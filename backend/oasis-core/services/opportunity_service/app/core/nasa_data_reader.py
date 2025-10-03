import h5py
import numpy as np
from pathlib import Path
from typing import Dict, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

# Try to import OSMnx for transport network analysis
try:
    import osmnx as ox
    import geopandas as gpd
    from shapely.geometry import box
    OSMNX_AVAILABLE = True
except ImportError:
    OSMNX_AVAILABLE = False
    logger.warning("OSMnx not available - transport network analysis will use estimates")

class NASADataReader:
    def __init__(self, data_dir: str = "../../data"):
        self.data_dir = Path(data_dir)
        self.modis_dir = self.data_dir / "MODIS"
        self.vnp_dir = self.data_dir / "VNP46A3"
        self._osm_network_cache = None  # Cache for road network
        self._osm_cache_bounds = None   # Store bounds used for caching
        
    def get_dhaka_bounds_in_tile(self, lat_min: float, lat_max: float, 
                                  lon_min: float, lon_max: float) -> Dict:
        tile_size = 1200
        tile_lat_start = 30.0
        tile_lon_start = 80.0
        tile_resolution = 0.00416667
        
        row_min = int((tile_lat_start - lat_max) / tile_resolution)
        row_max = int((tile_lat_start - lat_min) / tile_resolution)
        col_min = int((lon_min - tile_lon_start) / tile_resolution)
        col_max = int((lon_max - tile_lon_start) / tile_resolution)
        
        row_min = max(0, min(row_min, tile_size))
        row_max = max(0, min(row_max, tile_size))
        col_min = max(0, min(col_min, tile_size))
        col_max = max(0, min(col_max, tile_size))
        
        return {
            "row_min": row_min,
            "row_max": row_max,
            "col_min": col_min,
            "col_max": col_max
        }
    
    def read_nighttime_lights(self, lat_min: float, lat_max: float, 
                              lon_min: float, lon_max: float) -> Optional[np.ndarray]:
        try:
            vnp_files = sorted(self.vnp_dir.glob("VNP46A3.A2024*.h5")) + sorted(self.vnp_dir.glob("VNP46A3.A2025*.h5"))
            if not vnp_files:
                logger.warning("No VNP46A3 files found")
                return None
            
            latest_file = vnp_files[-1]
            logger.info(f"Reading nighttime lights from {latest_file.name}")
            
            with h5py.File(latest_file, 'r') as f:
                # VNP46A3 uses AllAngle_Composite_Snow_Free for tropical regions like Bangladesh
                dataset_path = 'HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/AllAngle_Composite_Snow_Free'
                lat_path = 'HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/lat'
                lon_path = 'HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/lon'
                
                if dataset_path not in f:
                    logger.error(f"Dataset {dataset_path} not found in {latest_file.name}")
                    return None
                
                dataset = f[dataset_path]
                lats = f[lat_path][:] if lat_path in f else None
                lons = f[lon_path][:] if lon_path in f else None
                
                # Read the raw data
                raw_data = dataset[:]
                
                # Apply scale factor and offset if available
                scale_factor = dataset.attrs.get('scale_factor', 1.0)
                offset = dataset.attrs.get('offset', 0.0)
                fill_value = dataset.attrs.get('_FillValue', 65535)
                
                # Convert to float and apply scaling
                data = raw_data.astype(float)
                data[raw_data == fill_value] = np.nan
                data = data * scale_factor + offset
                
                logger.info(f"Successfully read nighttime lights data - Shape: {data.shape}")
                
                # Find indices for Dhaka region using lat/lon arrays if available
                if lats is not None and lons is not None:
                    lat_indices = np.where((lats >= lat_min) & (lats <= lat_max))[0]
                    lon_indices = np.where((lons >= lon_min) & (lons <= lon_max))[0]
                    
                    if len(lat_indices) > 0 and len(lon_indices) > 0:
                        row_min, row_max = lat_indices[0], lat_indices[-1] + 1
                        col_min, col_max = lon_indices[0], lon_indices[-1] + 1
                        logger.info(f"Using lat/lon arrays: rows {row_min}-{row_max}, cols {col_min}-{col_max}")
                    else:
                        logger.warning("Dhaka coordinates not found in lat/lon arrays, using full tile")
                        row_min, row_max = 0, data.shape[0]
                        col_min, col_max = 0, data.shape[1]
                else:
                    # Fallback to estimated bounds
                    bounds = self.get_dhaka_bounds_in_tile(lat_min, lat_max, lon_min, lon_max)
                    row_min, row_max = bounds["row_min"], bounds["row_max"]
                    col_min, col_max = bounds["col_min"], bounds["col_max"]
                
                subset = data[row_min:row_max, col_min:col_max]
                
                # Replace negative values and NaN with 0
                subset = np.nan_to_num(subset, nan=0.0, posinf=0.0, neginf=0.0)
                subset = np.where(subset < 0, 0, subset)
                
                logger.info(f"Extracted Dhaka subset - Shape: {subset.shape}, Min: {subset.min():.2f}, Max: {subset.max():.2f}, Mean: {subset.mean():.2f}")
                
                return subset
                
        except Exception as e:
            logger.error(f"Error reading nighttime lights: {e}")
            return None
    
    def read_land_cover(self, lat_min: float, lat_max: float,
                        lon_min: float, lon_max: float) -> Optional[np.ndarray]:
        try:
            from pyhdf.SD import SD, SDC
            print("   Attempting to load MODIS land cover with pyhdf...")
            
            modis_files = list(self.modis_dir.glob("MCD12Q1.A2024*.hdf"))
            if not modis_files:
                print("   ⚠️  No MODIS files found in", self.modis_dir)
                logger.info("No MODIS land cover files found (this is OK)")
                return None
            
            print(f"   Found {len(modis_files)} MODIS files:")
            for f in modis_files:
                print(f"      - {f.name}")
            
            h26_file = [f for f in modis_files if 'h26v06' in f.name]
            if not h26_file:
                print("   ⚠️  h26v06 tile not found (need this tile for Dhaka)")
                logger.info("h26v06 tile not found (this is OK)")
                return None
            
            file_path = h26_file[0]
            print(f"   Opening: {file_path.name}")
            logger.info(f"Reading land cover from {file_path.name}")
            
            hdf = SD(str(file_path), SDC.READ)
            
            lc_dataset = hdf.select('LC_Type1')
            data = lc_dataset[:, :]
            print(f"   Successfully read MODIS data - Shape: {data.shape}")
            
            # MODIS h26v06 tile in sinusoidal projection
            # Covers roughly 80-90°E, 20-30°N
            # Dhaka (23.8°N, 90.4°E) is in the SE portion
            # Extract a region that covers Bangladesh
            tile_h, tile_w = data.shape
            
            # Extract SE quadrant (covers Dhaka region reliably)
            row_min = tile_h // 2  # Middle to bottom
            row_max = tile_h
            col_min = tile_w // 2  # Middle to right
            col_max = tile_w
            
            subset = data[row_min:row_max, col_min:col_max]
            
            print(f"   Extracted SE quadrant - Shape: {subset.shape}")
            
            hdf.end()
            
            return subset
            
        except ImportError as e:
            print(f"   ⚠️  pyhdf not available: {e}")
            logger.info("pyhdf not installed - MODIS land cover skipped (this is OK, nighttime lights will still work!)")
            return None
        
        except Exception as e:
            print(f"   ⚠️  Error reading MODIS: {e}")
            logger.info(f"Could not read MODIS land cover (this is OK): {e}")
            return None
    
    def read_transport_network(self, lat_min: float, lat_max: float,
                              lon_min: float, lon_max: float,
                              grid_size: int = 10) -> Optional[Dict]:
        """
        Download and analyze OpenStreetMap road network for transport access.
        Returns a dict mapping cell_id to transport_score (0-1).
        """
        if not OSMNX_AVAILABLE:
            print("   ⚠️  OSMnx not available")
            logger.info("OSMnx not available - using estimated transport access")
            return None
        
        try:
            # Check if we have cached network for the same bounds
            current_bounds = (lon_min, lat_min, lon_max, lat_max)
            
            if self._osm_network_cache is None or self._osm_cache_bounds != current_bounds:
                print("   Downloading OpenStreetMap road network for Dhaka...")
                logger.info("Fetching OSM road network")
                
                # Download all roads (drive network) for the bounding box
                # OSMnx expects bbox as a single tuple: (left, bottom, right, top)
                bbox = (lon_min, lat_min, lon_max, lat_max)
                G = ox.graph_from_bbox(
                    bbox,
                    network_type='drive',
                    simplify=True
                )
                
                print(f"   ✅ Downloaded road network - {len(G.nodes)} nodes, {len(G.edges)} edges")
                logger.info(f"OSM network: {len(G.nodes)} nodes, {len(G.edges)} edges")
                
                # Convert to GeoDataFrame and project to UTM for accurate length calculations
                edges = ox.graph_to_gdfs(G, nodes=False, edges=True)
                
                # Project to UTM (UTM zone 46N for Dhaka, Bangladesh)
                # EPSG:32646 is WGS 84 / UTM zone 46N
                print("   Projecting to UTM for accurate measurements...")
                edges_utm = edges.to_crs('EPSG:32646')
                
                # Cache the projected edges
                self._osm_network_cache = edges_utm
                self._osm_cache_bounds = current_bounds
            else:
                print("   ✅ Using cached road network")
                logger.info("Using cached OSM network")
                edges_utm = self._osm_network_cache
            
            # Calculate transport score for each grid cell
            lat_step = (lat_max - lat_min) / grid_size
            lon_step = (lon_max - lon_min) / grid_size
            
            transport_scores = {}
            
            for i in range(grid_size):
                for j in range(grid_size):
                    cell_id = i * grid_size + j + 1
                    
                    cell_min_lat = lat_min + (i * lat_step)
                    cell_max_lat = cell_min_lat + lat_step
                    cell_min_lon = lon_min + (j * lon_step)
                    cell_max_lon = cell_min_lon + lon_step
                    
                    # Create bounding box for this cell in lat/lon (EPSG:4326)
                    cell_box = box(cell_min_lon, cell_min_lat, cell_max_lon, cell_max_lat)
                    
                    # Project cell box to UTM to match the edges
                    cell_gdf = gpd.GeoSeries([cell_box], crs='EPSG:4326')
                    cell_box_utm = cell_gdf.to_crs('EPSG:32646').iloc[0]
                    
                    # Find roads that intersect this cell (now both in UTM)
                    roads_in_cell = edges_utm[edges_utm.intersects(cell_box_utm)]
                    
                    if len(roads_in_cell) > 0:
                        # Calculate total road length in cell (in meters, already in UTM)
                        total_length = roads_in_cell.length.sum()
                        
                        # Calculate cell area in square meters (from UTM polygon)
                        cell_area_m2 = cell_box_utm.area
                        
                        # Road density: meters of road per square meter of area
                        road_density = total_length / cell_area_m2
                        
                        # Normalize to 0-1 score (higher density = better access)
                        # Typical urban road density: 0.001 - 0.01 m/m²
                        transport_score = min(1.0, road_density / 0.008)
                    else:
                        transport_score = 0.0
                    
                    transport_scores[cell_id] = round(transport_score, 3)
            
            print(f"   ✅ Calculated transport scores for {len(transport_scores)} cells")
            logger.info(f"Transport analysis complete for {len(transport_scores)} cells")
            
            return transport_scores
            
        except Exception as e:
            print(f"   ⚠️  Error fetching OSM data: {e}")
            logger.error(f"OSM network analysis failed: {e}")
            return None
    
    def calculate_grid_metrics(self, lat_min: float, lat_max: float,
                               lon_min: float, lon_max: float,
                               grid_size: int = 10) -> Dict:
        print("\n" + "=" * 80)
        print("📡 READING NASA SATELLITE DATA")
        print("=" * 80)
        
        ntl_data = self.read_nighttime_lights(lat_min, lat_max, lon_min, lon_max)
        if ntl_data is not None:
            print(f"✅ VNP46A3 Nighttime Lights: LOADED")
            print(f"   Shape: {ntl_data.shape}, Mean: {ntl_data.mean():.2f}")
        else:
            print("❌ VNP46A3 Nighttime Lights: FAILED")
        
        lc_data = self.read_land_cover(lat_min, lat_max, lon_min, lon_max)
        if lc_data is not None:
            print(f"✅ MODIS Land Cover: LOADED")
            print(f"   Shape: {lc_data.shape}, Unique classes: {len(set(lc_data.flatten()))}")
        else:
            print("⚠️  MODIS Land Cover: NOT LOADED (using estimated food access)")
        
        transport_data = self.read_transport_network(lat_min, lat_max, lon_min, lon_max, grid_size)
        if transport_data is not None:
            print(f"✅ OpenStreetMap Transport Network: LOADED")
            print(f"   Analyzed {len(transport_data)} grid cells for road density")
        else:
            print("⚠️  Transport Network: NOT LOADED (using estimated transport access)")
        
        print("=" * 80 + "\n")
        
        lat_step = (lat_max - lat_min) / grid_size
        lon_step = (lon_max - lon_min) / grid_size
        
        grid_metrics = {}
        
        for i in range(grid_size):
            for j in range(grid_size):
                cell_id = i * grid_size + j + 1
                
                if ntl_data is not None:
                    ntl_rows = ntl_data.shape[0]
                    ntl_cols = ntl_data.shape[1]
                    
                    row_start = int(i * ntl_rows / grid_size)
                    row_end = int((i + 1) * ntl_rows / grid_size)
                    col_start = int(j * ntl_cols / grid_size)
                    col_end = int((j + 1) * ntl_cols / grid_size)
                    
                    cell_ntl = ntl_data[row_start:row_end, col_start:col_end]
                    avg_ntl = float(np.nanmean(cell_ntl)) if cell_ntl.size > 0 else 0
                    
                    housing_pressure = min(1.0, avg_ntl / 100.0)
                else:
                    housing_pressure = 0.5
                
                if lc_data is not None:
                    lc_rows = lc_data.shape[0]
                    lc_cols = lc_data.shape[1]
                    
                    row_start = int(i * lc_rows / grid_size)
                    row_end = int((i + 1) * lc_rows / grid_size)
                    col_start = int(j * lc_cols / grid_size)
                    col_end = int((j + 1) * lc_cols / grid_size)
                    
                    cell_lc = lc_data[row_start:row_end, col_start:col_end]
                    
                    cropland_pixels = np.sum((cell_lc >= 12) & (cell_lc <= 14))
                    total_pixels = cell_lc.size
                    cropland_ratio = cropland_pixels / total_pixels if total_pixels > 0 else 0
                    
                    food_distance = 8.0 * (1 - cropland_ratio)
                else:
                    # Estimate based on housing pressure: urban areas typically farther from food sources
                    food_distance = 3.0 + (housing_pressure * 4.0)  # 3-7 km range
                
                # Get transport score from real OSM data or estimate
                if transport_data is not None and cell_id in transport_data:
                    transport_score = transport_data[cell_id]
                else:
                    # Estimate: higher infrastructure = better transport
                    transport_score = 0.5 + (housing_pressure * 0.4)
                
                grid_metrics[cell_id] = {
                    'housing_pressure': round(housing_pressure, 3),
                    'food_distance_km': round(food_distance, 2),
                    'transport_score': round(transport_score, 3),
                    'avg_nighttime_light': round(avg_ntl, 2) if ntl_data is not None else 0
                }
        
        # Add metadata about what was loaded
        grid_metrics['_metadata'] = {
            'ntl_loaded': ntl_data is not None,
            'lc_loaded': lc_data is not None,
            'transport_loaded': transport_data is not None
        }
        
        return grid_metrics

nasa_reader = NASADataReader()

