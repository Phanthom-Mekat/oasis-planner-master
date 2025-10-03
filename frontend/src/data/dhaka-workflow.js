// Dhaka Urban Planning Data Workflow
// NASA Space Apps Challenge 2025 Implementation

/**
 * DHAKA CITY TASK BREAKDOWN - COMPLETE IMPLEMENTATION GUIDE
 * ========================================================
 * 
 * This file provides step-by-step instructions for implementing
 * the NASA Earth observation data analysis for Dhaka city urban planning.
 */

// =================== PHASE 1: DATA COLLECTION ===================

/**
 * Task 1: Population & Settlement Data
 * Timeline: Day 1, Hours 1-2
 */
const POPULATION_DATA_SOURCES = {
  nasa_sedac: {
    url: "https://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density-rev11",
    dataset: "Gridded Population of the World (GPW v4)",
    resolution: "30 arc-seconds (~1km)",
    coverage: "Dhaka District: 23.7°N, 90.4°E",
    format: "GeoTIFF",
    access: "Free registration required"
  },
  worldpop: {
    url: "https://www.worldpop.org/geodata/country/BGD",
    dataset: "Bangladesh Population 100m",
    resolution: "100m",
    years: "2015-2023",
    format: "GeoTIFF",
    access: "Open download"
  },
  ghsl: {
    url: "https://ghsl.jrc.ec.europa.eu/download.php",
    dataset: "Global Human Settlement Layer",
    resolution: "100m, 1km",
    years: "1975, 1990, 2000, 2015, 2020",
    format: "GeoTIFF",
    access: "Open download"
  }
};

/**
 * Task 2: Land Use & Agriculture Data
 * Timeline: Day 1, Hours 2-3
 */
const LAND_USE_DATA_SOURCES = {
  modis_land_cover: {
    url: "https://lpdaac.usgs.gov/products/mcd12q1v006/",
    dataset: "MODIS Land Cover Type (MCD12Q1)",
    resolution: "500m",
    temporal: "Annual, 2001-2023",
    format: "HDF-EOS",
    access: "NASA Earthdata login required"
  },
  viirs_nightlights: {
    url: "https://eogdata.mines.edu/products/vnl/",
    dataset: "VIIRS Black Marble Nighttime Lights",
    resolution: "500m",
    temporal: "Monthly, 2012-2024",
    format: "GeoTIFF",
    access: "Open download"
  },
  sentinel2_ndvi: {
    url: "https://scihub.copernicus.eu/",
    dataset: "Sentinel-2 NDVI",
    resolution: "10m, 20m",
    temporal: "5-day revisit",
    format: "SAFE",
    access: "Free registration"
  }
};

/**
 * Task 3: Air Quality Data
 * Timeline: Day 1, Hours 3-4
 */
const AIR_QUALITY_DATA_SOURCES = {
  tropomi_no2: {
    url: "https://s5phub.copernicus.eu/",
    dataset: "Sentinel-5P TROPOMI NO2",
    resolution: "5.5km x 3.5km",
    temporal: "Daily",
    format: "NetCDF",
    access: "Free registration",
    google_earth_engine: "COPERNICUS/S5P/NRTI/L3_NO2"
  },
  modis_aod: {
    url: "https://giovanni.gsfc.nasa.gov/giovanni/",
    dataset: "MODIS Aerosol Optical Depth",
    resolution: "1km, 10km",
    temporal: "Daily",
    format: "HDF-EOS",
    access: "Giovanni web interface (no download needed)"
  },
  viirs_aod: {
    url: "https://ladsweb.modaps.eosdis.nasa.gov/",
    dataset: "VIIRS Aerosol Optical Depth",
    resolution: "750m",
    temporal: "Daily",
    format: "NetCDF",
    access: "NASA Earthdata login"
  }
};

// =================== PHASE 2: DATA PROCESSING ===================

/**
 * Google Earth Engine Implementation
 * Timeline: Day 1, Hours 4-8
 */
const GEE_WORKFLOW = `
// Google Earth Engine JavaScript Code for Dhaka Analysis

// Define Dhaka study area
var dhaka = ee.Geometry.Rectangle([90.2, 23.5, 90.6, 23.9]);

// Load population data
var population = ee.ImageCollection("WorldPop/GP/100m/pop")
  .filter(ee.Filter.eq('country', 'BGD'))
  .filter(ee.Filter.eq('year', 2023))
  .first()
  .clip(dhaka);

// Load TROPOMI NO2 data
var no2Collection = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
  .select('NO2_column_number_density')
  .filterDate('2024-01-01', '2024-12-31')
  .filterBounds(dhaka);

var no2_mean = no2Collection.mean().clip(dhaka);

// Load nighttime lights
var ntl = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG")
  .select('avg_rad')
  .filterDate('2024-01-01', '2024-12-31')
  .mean()
  .clip(dhaka);

// Load MODIS land cover
var landcover = ee.ImageCollection("MODIS/006/MCD12Q1")
  .filter(ee.Filter.date('2023-01-01', '2023-12-31'))
  .first()
  .select('LC_Type1')
  .clip(dhaka);

// Calculate NDVI from Sentinel-2
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterDate('2024-06-01', '2024-08-31') // Summer months
  .filterBounds(dhaka)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

var ndvi = s2.map(function(image) {
  return image.normalizedDifference(['B8', 'B4']).rename('NDVI');
}).mean().clip(dhaka);

// Export results
Export.image.toDrive({
  image: population,
  description: 'dhaka_population_2023',
  scale: 100,
  region: dhaka,
  maxPixels: 1e9
});

Export.image.toDrive({
  image: no2_mean,
  description: 'dhaka_no2_2024_mean',
  scale: 1000,
  region: dhaka,
  maxPixels: 1e9
});

Export.image.toDrive({
  image: ntl,
  description: 'dhaka_nightlights_2024',
  scale: 500,
  region: dhaka,
  maxPixels: 1e9
});

Export.image.toDrive({
  image: ndvi,
  description: 'dhaka_ndvi_summer_2024',
  scale: 10,
  region: dhaka,
  maxPixels: 1e9
});
`;

/**
 * Python Data Processing Pipeline
 * Timeline: Day 1, Hours 8-12
 */
const PYTHON_PROCESSING = `
# dhaka_analysis.py
import numpy as np
import pandas as pd
import rasterio
import geopandas as gpd
from rasterio.mask import mask
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

class DhakaUrbanAnalysis:
    def __init__(self, data_dir):
        self.data_dir = data_dir
        self.dhaka_bounds = [90.2, 23.5, 90.6, 23.9]  # [minx, miny, maxx, maxy]
        
    def load_population_data(self):
        """Load and process population density data"""
        pop_file = f"{self.data_dir}/dhaka_population_2023.tif"
        with rasterio.open(pop_file) as src:
            population = src.read(1)
            transform = src.transform
            crs = src.crs
        return population, transform, crs
        
    def load_air_quality_data(self):
        """Load and process air quality data"""
        no2_file = f"{self.data_dir}/dhaka_no2_2024_mean.tif"
        with rasterio.open(no2_file) as src:
            no2 = src.read(1)
            # Convert from mol/m2 to μg/m3 (approximate)
            no2_ugm3 = no2 * 1e6 * 46.01 / 6.022e23 * 1e3
        return no2_ugm3
        
    def calculate_access_scores(self):
        """Calculate food, housing, transport access scores"""
        # Load nighttime lights as infrastructure proxy
        ntl_file = f"{self.data_dir}/dhaka_nightlights_2024.tif"
        with rasterio.open(ntl_file) as src:
            nightlights = src.read(1)
            
        # Load NDVI for greenspace/agriculture
        ndvi_file = f"{self.data_dir}/dhaka_ndvi_summer_2024.tif"
        with rasterio.open(ndvi_file) as src:
            ndvi = src.read(1)
            
        # Calculate access indices (simplified)
        food_access = np.where(ndvi > 0.3, 8, 4)  # Higher NDVI = better food access
        housing_quality = np.clip(nightlights * 2, 0, 10)  # Nightlights as housing proxy
        transport_score = np.clip(nightlights * 1.5, 0, 10)  # Infrastructure proxy
        
        return food_access, housing_quality, transport_score
        
    def identify_priority_areas(self):
        """Identify high-priority areas for intervention"""
        population, transform, crs = self.load_population_data()
        no2 = self.load_air_quality_data()
        food_access, housing_quality, transport_score = self.calculate_access_scores()
        
        # Normalize all layers
        scaler = MinMaxScaler()
        pop_norm = scaler.fit_transform(population.reshape(-1, 1)).reshape(population.shape)
        no2_norm = scaler.fit_transform(no2.reshape(-1, 1)).reshape(no2.shape)
        
        # Calculate vulnerability index
        vulnerability = (
            pop_norm * 0.3 +          # Population exposure
            no2_norm * 0.3 +          # Air pollution
            (10 - food_access) * 0.1 + # Food access deficit
            (10 - housing_quality) * 0.2 + # Housing quality deficit
            (10 - transport_score) * 0.1   # Transport access deficit
        )
        
        return vulnerability, population, no2
        
    def generate_recommendations(self):
        """Generate specific site recommendations"""
        vulnerability, population, no2 = self.identify_priority_areas()
        
        # Find top 10 priority grid cells
        flat_indices = np.unravel_index(
            np.argsort(vulnerability.ravel())[-10:], 
            vulnerability.shape
        )
        
        recommendations = []
        for i, (row, col) in enumerate(zip(flat_indices[0], flat_indices[1])):
            rec = {
                'rank': i + 1,
                'location': f"Grid_{row}_{col}",
                'vulnerability_score': vulnerability[row, col],
                'population': population[row, col],
                'no2_level': no2[row, col],
                'intervention_type': self._get_intervention_type(
                    vulnerability[row, col], 
                    no2[row, col], 
                    population[row, col]
                )
            }
            recommendations.append(rec)
            
        return recommendations
        
    def _get_intervention_type(self, vuln, no2, pop):
        """Determine intervention type based on conditions"""
        if no2 > 50 and pop > 1000:
            return "Air quality mitigation + green corridors"
        elif vuln > 0.7 and pop > 500:
            return "Comprehensive urban upgrade"
        elif pop > 800:
            return "Infrastructure development"
        else:
            return "Monitoring and planning"

# Usage
analyzer = DhakaUrbanAnalysis("/path/to/data")
recommendations = analyzer.generate_recommendations()
for rec in recommendations:
    print(f"Rank {rec['rank']}: {rec['intervention_type']} at {rec['location']}")
`;

// =================== PHASE 3: WEB IMPLEMENTATION ===================

/**
 * React Component Integration
 * Timeline: Day 2, Hours 1-6
 */
const REACT_INTEGRATION = `
// components/DhakaAnalysisMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DhakaAnalysisMap = () => {
  const [layers, setLayers] = useState({
    population: null,
    airQuality: null,
    vulnerability: null,
    recommendations: null
  });
  
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  
  useEffect(() => {
    // Load processed data from API
    loadMapLayers();
  }, []);
  
  const loadMapLayers = async () => {
    try {
      const response = await fetch('/api/dhaka/map-data');
      const data = await response.json();
      setLayers(data.layers);
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };
  
  const handleRecommendationClick = (recommendation) => {
    setSelectedRecommendation(recommendation);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dhaka Urban Planning Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <MapContainer 
                center={[23.7, 90.4]} 
                zoom={11} 
                style={{ height: '500px', width: '100%' }}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="NASA GIBS"
                />
                
                <LayersControl position="topright">
                  <LayersControl.Overlay name="Population Density">
                    {layers.population && <GeoJSON data={layers.population} />}
                  </LayersControl.Overlay>
                  
                  <LayersControl.Overlay name="Air Quality (NO₂)">
                    {layers.airQuality && <GeoJSON data={layers.airQuality} />}
                  </LayersControl.Overlay>
                  
                  <LayersControl.Overlay name="Vulnerability Index">
                    {layers.vulnerability && <GeoJSON data={layers.vulnerability} />}
                  </LayersControl.Overlay>
                  
                  <LayersControl.Overlay name="Recommendations" checked>
                    {layers.recommendations && (
                      <GeoJSON 
                        data={layers.recommendations}
                        onEachFeature={(feature, layer) => {
                          layer.on('click', () => {
                            handleRecommendationClick(feature.properties);
                          });
                        }}
                      />
                    )}
                  </LayersControl.Overlay>
                </LayersControl>
              </MapContainer>
            </div>
            
            {/* Recommendations Panel */}
            <div>
              <h3 className="font-semibold mb-4">Priority Interventions</h3>
              {selectedRecommendation ? (
                <RecommendationDetail recommendation={selectedRecommendation} />
              ) : (
                <div className="text-sm text-slate-600">
                  Click on a recommendation marker to see details
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RecommendationDetail = ({ recommendation }) => (
  <div className="space-y-4">
    <div>
      <h4 className="font-medium">{recommendation.intervention_type}</h4>
      <p className="text-sm text-slate-600">{recommendation.location}</p>
    </div>
    
    <div className="space-y-2">
      <div>
        <span className="text-xs text-slate-500">Vulnerability Score:</span>
        <div className="font-medium">{recommendation.vulnerability_score.toFixed(2)}</div>
      </div>
      
      <div>
        <span className="text-xs text-slate-500">Affected Population:</span>
        <div className="font-medium">{recommendation.population.toLocaleString()}</div>
      </div>
      
      <div>
        <span className="text-xs text-slate-500">NO₂ Level:</span>
        <div className="font-medium">{recommendation.no2_level.toFixed(1)} μg/m³</div>
      </div>
    </div>
    
    <div className="p-3 bg-blue-50 rounded">
      <div className="text-xs text-blue-700 font-medium">Data Sources:</div>
      <div className="text-xs text-blue-600">
        NASA SEDAC, TROPOMI, MODIS, WorldPop
      </div>
    </div>
  </div>
);

export default DhakaAnalysisMap;
`;

// =================== PHASE 4: PRESENTATION MATERIALS ===================

/**
 * Pitch Presentation Structure
 * Timeline: Day 2, Hours 8-12
 */
const PRESENTATION_OUTLINE = {
  slide1_problem: {
    title: "Dhaka's Urban Challenge",
    content: [
      "22 million people in rapidly growing megacity",
      "Air pollution 3x WHO standards",
      "40% live in informal settlements",
      "Transportation gaps disconnect communities"
    ],
    visual: "Satellite image showing urban sprawl"
  },
  
  slide2_solution: {
    title: "NASA Earth Data for Smart Planning",
    content: [
      "TROPOMI air quality monitoring",
      "SEDAC population mapping",
      "MODIS land use analysis",
      "VIIRS infrastructure tracking"
    ],
    visual: "Data integration workflow diagram"
  },
  
  slide3_demo: {
    title: "Interactive Urban Analysis Platform",
    content: "Live demo of dashboard with real Dhaka data",
    time: "90 seconds",
    focus: "Click through vulnerability maps and recommendations"
  },
  
  slide4_impact: {
    title: "Actionable Insights for City Leaders",
    content: [
      "Top 10 priority intervention sites identified",
      "Air quality mitigation strategies mapped",
      "Housing development zones recommended",
      "Transport corridor optimization planned"
    ],
    visual: "Before/after intervention mockups"
  },
  
  slide5_next_steps: {
    title: "Scaling & Implementation",
    content: [
      "Partner with Dhaka City Corporation",
      "Integrate with city planning workflows",
      "Expand to other South Asian megacities",
      "Real-time monitoring system deployment"
    ]
  }
};

// =================== IMPLEMENTATION CHECKLIST ===================

const IMPLEMENTATION_CHECKLIST = {
  day1: {
    "Hour 1-2": [
      "□ Set up Google Earth Engine account",
      "□ Download Dhaka administrative boundaries",
      "□ Access SEDAC population data",
      "□ Download WorldPop Bangladesh data"
    ],
    "Hour 3-4": [
      "□ Run GEE script for TROPOMI NO₂ data",
      "□ Export MODIS AOD via Giovanni",
      "□ Download VIIRS nighttime lights",
      "□ Process Sentinel-2 NDVI data"
    ],
    "Hour 5-8": [
      "□ Set up Python analysis environment",
      "□ Process all raster data to common grid",
      "□ Calculate vulnerability indices",
      "□ Generate priority site recommendations"
    ],
    "Hour 9-12": [
      "□ Create GeoJSON outputs for web mapping",
      "□ Build basic React dashboard",
      "□ Integrate processed data layers",
      "□ Test map functionality"
    ]
  },
  
  day2: {
    "Hour 1-4": [
      "□ Enhance dashboard with Dhaka tabs",
      "□ Add interactive recommendation system",
      "□ Create data visualization charts",
      "□ Implement real-time data refresh"
    ],
    "Hour 5-8": [
      "□ Prepare presentation slides",
      "□ Record demo video segments",
      "□ Create data source documentation",
      "□ Write project README"
    ],
    "Hour 9-12": [
      "□ Final testing and bug fixes",
      "□ Complete presentation recording",
      "□ Upload to GitHub repository",
      "□ Prepare judges Q&A responses"
    ]
  }
};

export {
  POPULATION_DATA_SOURCES,
  LAND_USE_DATA_SOURCES,
  AIR_QUALITY_DATA_SOURCES,
  GEE_WORKFLOW,
  PYTHON_PROCESSING,
  REACT_INTEGRATION,
  PRESENTATION_OUTLINE,
  IMPLEMENTATION_CHECKLIST
};
