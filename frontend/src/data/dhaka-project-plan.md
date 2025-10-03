# NASA Space Apps Challenge 2025: Dhaka City Project Plan
## Data Pathways to Healthy Cities - Dhaka Case Study

### Project Overview
**Title:** UrbanSight Dhaka - NASA Earth Observation for Smart Urban Planning

**Focus City:** Dhaka, Bangladesh
- Population: ~22 million (metropolitan area)
- Growth rate: 3.5% annually
- Key challenges: Air pollution, flooding, rapid urbanization, informal settlements

### Three Core Questions & Task Breakdown

## 1. Food, Housing & Transportation Access 🥕🏘️🚍

### Task 1.1: Population & Settlement Mapping
**Timeline:** Day 1, Hours 1-3
**Datasets:**
- NASA SEDAC Gridded Population of World (GPW v4)
- EU Copernicus GHSL Built-up Area (1975-2020)
- WorldPop Bangladesh 100m resolution data
- NASA Black Marble (VIIRS Nighttime Lights 2018-2024)

**Sub-tasks:**
- [ ] Download Dhaka metropolitan area boundary (23.7°N, 90.4°E, ~50km radius)
- [ ] Extract population density grids from SEDAC/WorldPop
- [ ] Download GHSL built-up area time series (2000, 2010, 2020)
- [ ] Get nighttime lights data for infrastructure proxy
- [ ] Create composite population density map

### Task 1.2: Food Access Analysis
**Timeline:** Day 1, Hours 3-5
**Datasets:**
- MODIS Land Cover Type (MCD12Q1) for agricultural land
- NASA Earthdata Worldview NDVI for vegetation/cropland
- OpenStreetMap for markets and food distribution centers

**Sub-tasks:**
- [ ] Identify agricultural zones within 50km of Dhaka
- [ ] Map existing markets using OSM data + nighttime lights
- [ ] Calculate distance from high-density residential to food sources
- [ ] Identify "food desert" neighborhoods (>5km from agriculture/markets)
- [ ] Overlay with transportation networks

### Task 1.3: Housing Needs Assessment
**Timeline:** Day 1, Hours 5-7
**Sub-tasks:**
- [ ] Compare population growth vs. built-up area expansion
- [ ] Identify informal settlements (high pop, low nighttime lights)
- [ ] Map flood-prone areas using MODIS surface water + DEM
- [ ] Calculate housing density stress indicators
- [ ] Prioritize areas for affordable housing development

### Task 1.4: Transportation Gap Analysis
**Timeline:** Day 1, Hours 7-9
**Sub-tasks:**
- [ ] Map road networks using OSM + nighttime lights validation
- [ ] Calculate accessibility to employment centers (CBD, industrial zones)
- [ ] Identify disconnected high-density neighborhoods
- [ ] Assess public transport coverage gaps
- [ ] Recommend new transit corridors

## 2. Air & Water Pollution Monitoring 💨💧

### Task 2.1: Air Quality Hotspot Mapping
**Timeline:** Day 1, Hours 9-12
**Datasets:**
- ESA Sentinel-5P TROPOMI (NO₂, SO₂, CO)
- NASA MODIS/VIIRS Aerosol Optical Depth (AOD)
- Landsat 8/9 thermal bands for industrial hotspots

**Sub-tasks:**
- [ ] Download 1-year of TROPOMI NO₂ data for Dhaka region
- [ ] Get MODIS AOD summer/winter averages (2023-2024)
- [ ] Identify major pollution sources (industrial, traffic)
- [ ] Create seasonal pollution exposure maps
- [ ] Overlay with population density for health risk assessment

### Task 2.2: Water Quality Assessment
**Timeline:** Day 2, Hours 1-4
**Datasets:**
- Landsat 8/9 for water turbidity in Buriganga River
- Sentinel-2 for detailed water quality indicators
- MODIS Aqua for chlorophyll-a in water bodies

**Sub-tasks:**
- [ ] Map Dhaka's major rivers (Buriganga, Turag, Balu, Shitalakshya)
- [ ] Calculate water turbidity index using Landsat bands
- [ ] Identify industrial discharge points along rivers
- [ ] Assess seasonal water quality changes
- [ ] Map communities dependent on river water

### Task 2.3: Pollution Mitigation Strategies
**Timeline:** Day 2, Hours 4-6
**Sub-tasks:**
- [ ] Identify priority areas for air quality intervention
- [ ] Recommend green buffer zones near industrial areas
- [ ] Propose water treatment facility locations
- [ ] Design low-emission transport corridors
- [ ] Create pollution monitoring network recommendations

## 3. Urban Growth & Housing Development 📈🏙️

### Task 3.1: Growth Pattern Analysis
**Timeline:** Day 2, Hours 6-8
**Datasets:**
- NASA Black Marble time series (2012-2024)
- GHSL urban expansion datasets
- Landsat/Sentinel-2 land cover change

**Sub-tasks:**
- [ ] Calculate annual urban expansion rate
- [ ] Identify fastest-growing neighborhoods
- [ ] Map informal settlement expansion
- [ ] Assess infrastructure lag in growth areas
- [ ] Predict future growth scenarios

### Task 3.2: Land Availability Assessment
**Timeline:** Day 2, Hours 8-10
**Sub-tasks:**
- [ ] Map undeveloped land suitable for housing
- [ ] Exclude flood-prone areas using elevation + flood history
- [ ] Calculate development capacity for each district
- [ ] Assess proximity to existing infrastructure
- [ ] Recommend priority development zones

### Task 3.3: Smart Growth Planning
**Timeline:** Day 2, Hours 10-12
**Sub-tasks:**
- [ ] Create integrated growth suitability index
- [ ] Balance housing needs with environmental protection
- [ ] Recommend transit-oriented development sites
- [ ] Plan green corridor integration
- [ ] Design climate-resilient housing locations

## Technical Implementation Tasks

### Task 4.1: Data Integration Platform
**Timeline:** Throughout project
**Tech Stack:**
- Backend: Python (FastAPI)
- Frontend: React + existing ClimateOverview component
- Maps: Leaflet with NASA GIBS tiles
- Data: Google Earth Engine for processing

**Sub-tasks:**
- [ ] Set up Google Earth Engine access
- [ ] Create data processing pipeline
- [ ] Build REST API for map data
- [ ] Integrate with existing React dashboard
- [ ] Add Dhaka-specific data layers

### Task 4.2: Dashboard Enhancement
**Timeline:** Day 2, Hours 1-12
**Sub-tasks:**
- [ ] Add "Dhaka Analysis" tab to existing ClimateOverview
- [ ] Create interactive vulnerability maps
- [ ] Build recommendation system UI
- [ ] Add community input forms
- [ ] Implement real-time data refresh

### Task 4.3: Visualization & Storytelling
**Timeline:** Day 2, Hours 8-12
**Sub-tasks:**
- [ ] Create compelling data visualizations
- [ ] Build interactive map with layer controls
- [ ] Design recommendation cards with evidence
- [ ] Prepare demo presentation materials
- [ ] Create 3-5 minute pitch video

## Deliverables Checklist

### Core Outputs:
- [ ] Interactive web dashboard with Dhaka focus
- [ ] Vulnerability assessment maps (food, housing, transport, pollution, growth)
- [ ] Top 10 priority intervention sites with justifications
- [ ] Policy recommendations for each focus area
- [ ] Community engagement framework

### Presentation Materials:
- [ ] 3-5 minute demo video
- [ ] Slide deck with problem-data-solution flow
- [ ] GitHub repository with code and documentation
- [ ] Data sources and methodology documentation

## Data Sources Quick Reference

### NASA Core Datasets:
1. **SEDAC** - Population, urban settlements, socioeconomic data
2. **MODIS** - Land cover, vegetation, aerosols, surface temperature
3. **VIIRS** - Nighttime lights, fire detection
4. **Landsat** - High-resolution land use, water quality, thermal
5. **TROPOMI** - Air quality (NO₂, SO₂, CO, O₃)

### Partner Datasets:
1. **EU Copernicus GHSL** - Urban expansion time series
2. **WorldPop** - High-resolution population grids
3. **OpenStreetMap** - Roads, buildings, points of interest
4. **Sentinel-2** - High-resolution land cover and water quality

## Success Metrics

### Technical Metrics:
- Coverage: 100% of Dhaka metropolitan area analyzed
- Resolution: 100-300m grid for all analyses
- Temporal: Multi-year trends for growth analysis
- Accuracy: Validation against known hotspots

### Impact Metrics:
- Actionability: 10+ specific site recommendations
- Stakeholder engagement: Clear governance pathways
- Usability: <5 clicks to generate priority list
- Innovation: Novel integration of multiple NASA datasets

## Risk Mitigation

### Technical Risks:
- **Data access delays** → Use Giovanni for quick access
- **Processing time limits** → Focus on 2-3 key indicators
- **Display performance** → Pre-compute map tiles

### Content Risks:
- **Local validation** → Use ground truth from news/reports
- **Cultural sensitivity** → Include community input mechanisms
- **Political feasibility** → Focus on technical recommendations

## Next Steps Post-Hackathon

1. **Pilot Implementation** - Partner with Dhaka city planning authority
2. **Ground Truth Validation** - Field verification of satellite findings
3. **Community Engagement** - Resident feedback integration
4. **Real-time Monitoring** - Automated alert system for pollution/growth
5. **Replication** - Adapt framework for other South Asian megacities
