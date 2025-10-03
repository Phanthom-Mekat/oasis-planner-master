# Urban Planner AI Assistant 🏙️

An intelligent AI assistant powered by **NASA Earth observation data** and **Google Gemini**, designed specifically for urban planners working on sustainable, resilient, and equitable cities.

---

## 🎯 Purpose

This system transforms NASA's Earth observation APIs into **actionable urban planning insights** for cities like Dhaka, Bangladesh. Instead of exploring space, it helps planners:

- Monitor urban growth with satellite imagery
- Assess disaster risks and climate resilience
- Analyze air quality and pollution
- Identify urban heat islands
- Evaluate green space equity
- Track flood zones
- Monitor economic development through nighttime lights

---

## 🛠️ Urban Planning Tools

### 1. **Satellite Imagery Analysis** 🛰️
```python
get_city_satellite_imagery(lat, lon, date, dim)
```
**Use Cases:**
- Monitor urban sprawl
- Assess land use changes
- Track construction activity
- Evaluate green space coverage
- Before/after disaster comparisons

**Example Query:** "Show me satellite imagery of Dhaka from the last 6 months"

---

### 2. **Natural Disaster Tracking** 🌪️
```python
get_natural_disasters(days, bbox)
```
**Use Cases:**
- Real-time disaster monitoring
- Emergency response planning
- Risk assessment for new developments
- Climate adaptation strategies
- Infrastructure resilience planning

**Example Query:** "Are there any floods or storms affecting Bangladesh?"

---

### 3. **Air Quality & Pollution Analysis** 💨
```python
analyze_air_quality_trends(lat, lon, start_date, end_date)
```
**Use Cases:**
- Industrial zoning decisions
- Traffic management policies
- Public health assessments
- Green space planning
- Construction dust monitoring

**Example Query:** "Analyze air quality trends in Dhaka over the past year"

---

### 4. **Urban Heat Island Assessment** 🔥
```python
assess_urban_heat_islands(lat, lon, city_name)
```
**Use Cases:**
- Climate adaptation planning
- Cool roof programs
- Tree planting strategies
- Public health interventions
- Energy efficiency policies

**Example Query:** "Identify urban heat islands in Dhaka and suggest cooling strategies"

---

### 5. **Urban Sprawl Monitoring** 🏘️
```python
monitor_urban_sprawl(city_name, lat, lon, years_back)
```
**Use Cases:**
- Growth boundary enforcement
- Agricultural land protection
- Infrastructure capacity planning
- Transit-oriented development
- Environmental impact assessment

**Example Query:** "Track urban sprawl in Dhaka over the last 5 years"

---

### 6. **Flood Risk Assessment** 💧
```python
analyze_flood_risk_zones(city_name, lat, lon)
```
**Use Cases:**
- Drainage system planning
- Building code updates
- Emergency evacuation routes
- Blue-green infrastructure
- Land use restrictions

**Example Query:** "Assess flood risk zones in Dhaka for infrastructure planning"

---

### 7. **Green Space Equity Analysis** 🌳
```python
assess_green_space_distribution(city_name, lat, lon)
```
**Use Cases:**
- Park accessibility planning
- Environmental justice
- Public health improvements
- Climate resilience
- Property value impacts

**Example Query:** "Analyze green space distribution and equity in Dhaka"

---

### 8. **Economic Activity Analysis** 💡
```python
analyze_nighttime_lights(city_name, lat, lon)
```
**Use Cases:**
- Infrastructure gap identification
- Informal settlement detection
- Economic development monitoring
- Electricity access planning
- Service delivery prioritization

**Example Query:** "Analyze nighttime lights to identify underserved areas in Dhaka"

---

## 🗺️ Deck.gl Visualization Integration

The system automatically visualizes planning data on an interactive 3D map using deck.gl:

### **Visualization Types**

1. **Satellite Imagery Overlay** (`BitmapLayer`)
   - Real-time satellite images
   - Historical comparison layers
   - Transparent overlays on map

2. **Disaster Markers** (`ScatterplotLayer` + `TextLayer`)
   - Active disasters shown as red dots
   - Labels with disaster type
   - Clickable for details

3. **Analysis Points** (`ScatterplotLayer` + `TextLayer`)
   - Color-coded by analysis type:
     - 🟢 Green = Green space analysis
     - 🔵 Blue = Flood risk analysis
     - 🔴 Red = Heat island analysis
   - Pulsing animations
   - Interactive labels

### **Map Features**
- **3D Perspective**: 45° pitch for depth perception
- **Dark Theme**: Professional cartography style
- **Interactive**: Pan, zoom, rotate
- **Tooltips**: Hover for details
- **Auto-centering**: Focuses on analysis areas

---

## 💬 Example Conversations

### **Scenario 1: Flood Preparedness**
```
User: "I need to assess flood risk for a new residential development in Dhaka"

AI: *Uses analyze_flood_risk_zones() + get_city_satellite_imagery()*

Response:
📊 Key Finding: The proposed site is in a moderate-high flood risk zone (3-5m elevation)

🎯 Planning Implications:
- Site is within 500m of drainage channel
- Historical flooding in monsoon season
- Poor soil drainage capacity

✅ Recommendations (Priority Order):
1. Require elevated ground floors (min 1.5m above grade)
2. Install blue-green infrastructure (retention ponds)
3. Upgrade adjacent drainage systems
4. Restrict basement construction
5. Design flood-resistant utilities

📍 Visualization: [Shows satellite imagery + flood risk zones on map]

📋 Next Steps:
- Commission detailed topographic survey
- Model drainage capacity for 100-year flood
- Consult with water management authority
```

---

### **Scenario 2: Urban Heat Mitigation**
```
User: "Which neighborhoods in Dhaka have the worst urban heat islands?"

AI: *Uses assess_urban_heat_islands() + assess_green_space_distribution()*

Response:
📊 Key Findings:
- Commercial district: 5-7°C hotter than surrounding areas
- Industrial zones: Minimal vegetation, dark roofs
- Dense residential: <10% tree canopy

🎯 Planning Implications:
- Public health risk during heat waves
- Increased energy consumption
- Poor outdoor comfort

✅ Mitigation Strategy (Phased):
Phase 1 (Immediate):
- Cool roof program for 500 commercial buildings
- Plant 10,000 street trees in priority zones

Phase 2 (2-year):
- Create 5 new pocket parks in hot zones
- Green corridor along major roads
- Rooftop garden incentive program

Phase 3 (5-year):
- 30% tree canopy target
- Preserve all water bodies
- Shade structure mandate for public spaces

📍 Visualization: [Shows heat map overlay + green space gaps]
```

---

### **Scenario 3: Disaster Response**
```
User: "Are there any natural disasters I should be aware of for emergency planning?"

AI: *Uses get_natural_disasters(bbox='88,20,93,27')*

Response:
⚠️ Active Events in Bangladesh Region:

1. 🌊 Flood - Northern Districts
   - Date: 2025-10-01
   - Coordinates: [89.5, 25.2]
   - Impact: Drainage assessment needed, evacuation route review

2. 🔥 Wildfire - Chittagong Hill Tracts
   - Date: 2025-09-28
   - Coordinates: [92.1, 22.5]
   - Impact: Air quality monitoring, firebreak maintenance

📍 Visualization: [Shows disaster locations on map]

🎯 Planning Actions:
- Activate emergency operation center
- Review evacuation shelters capacity
- Update hazard communication systems
- Inspect critical infrastructure
```

---

## 🏗️ Urban Planning Workflows

### **Workflow 1: New Development Site Selection**
1. Get satellite imagery of potential sites
2. Assess flood risk zones
3. Analyze green space proximity
4. Check disaster history
5. Evaluate nighttime lights (existing development)
6. Compare sites with weighted criteria

### **Workflow 2: Climate Adaptation Plan**
1. Identify urban heat islands
2. Assess flood risk areas
3. Evaluate green space equity
4. Monitor urban sprawl patterns
5. Develop integrated mitigation strategies

### **Workflow 3: Infrastructure Investment Prioritization**
1. Analyze nighttime lights (underserved areas)
2. Track natural disasters (risk zones)
3. Assess green space equity (health needs)
4. Monitor air quality (pollution hotspots)
5. Create priority investment map

---

## 🎨 Frontend UI Features

### **Split-Screen Design**
- **Left (60%)**: Interactive deck.gl map with live visualizations
- **Right (40%)**: AI chat interface with analysis results

### **Map Interactions**
- Pan/zoom/rotate with mouse
- Click markers for details
- Toggle layers
- Auto-focus on analysis areas

### **Chat Features**
- Real-time AI responses
- Quick action buttons for common queries
- Tool call indicators
- Visualization data extraction

### **Quick Actions**
- 🛰️ Satellite View of Dhaka
- 🌪️ Disaster Tracking
- 💧 Flood Risk Analysis
- 🔥 Urban Heat Islands
- 🌳 Green Space Equity
- 📈 Urban Sprawl

---

## 📊 Data Sources & NASA APIs

| Tool | NASA API/Dataset | Resolution | Coverage |
|------|------------------|------------|----------|
| Satellite Imagery | Landsat 8 | 30m | Global |
| Disasters | EONET | Event-based | Global |
| Air Quality | MODIS/Aura | 1km | Global |
| Heat Islands | MODIS LST | 1km | Global |
| Urban Sprawl | Landsat + VIIRS | 30m + 500m | Global |
| Flood Risk | SRTM DEM | 30m | Global |
| Green Space | MODIS NDVI | 250m | Global |
| Nighttime Lights | VIIRS Black Marble | 500m | Global |

---

## 🚀 Getting Started

### **1. Start the Backend**
```bash
cd backend/oasis-core/services/nasa_agent_service
python -m uvicorn app.main:app --reload --port 8004
```

### **2. Access the UI**
Navigate to: `http://localhost:3000/dashboard/nasa-agent`

### **3. Try a Query**
Click **"Satellite View of Dhaka"** or type:
```
"Show me satellite imagery of Dhaka and assess flood risk zones"
```

### **4. Explore the Map**
- Click on markers for details
- Zoom into specific neighborhoods
- Compare different analyses

---

## 🔧 Customization

### **Add New Cities**
Update coordinates in `urban_planning_tools.py`:
```python
# Manila, Philippines
lat=14.5995, lon=120.9842

# Lagos, Nigeria
lat=6.5244, lon=3.3792
```

### **Adjust Analysis Parameters**
- Flood risk thresholds
- Heat island temperature deltas
- Green space targets
- Disaster search radius

### **Custom Visualizations**
Add new deck.gl layers in `UrbanPlannerAI.jsx`:
```javascript
new HexagonLayer({
  id: 'density-hexagons',
  data: populationData,
  getPosition: d => d.coordinates,
  getElevationWeight: d => d.population,
  elevationScale: 100
})
```

---

## 📚 Planning Standards Referenced

- **WHO**: 9m² green space per person minimum
- **UN-Habitat**: Sustainable urban development goals
- **IPCC**: Climate adaptation best practices
- **World Bank**: Urban resilience frameworks
- **C40 Cities**: Climate action planning

---

## 🤝 Integration with Existing Features

This AI Assistant complements your existing Oasis Planner features:

1. **Opportunity Mapper** - Provides satellite context for access analysis
2. **Urban Growth Predictor** - AI explains growth patterns with NASA data
3. **Simulation Service** - Test interventions suggested by AI

---

## 📈 Monitoring & KPIs

Track planning effectiveness:
- Urban heat reduction targets
- Green space access improvement
- Flood resilience metrics
- Air quality trends
- Disaster preparedness levels

---

## 🎓 Best Practices

1. **Always provide context** - City name, neighborhood, specific challenge
2. **Combine multiple analyses** - Holistic understanding
3. **Visualize on map** - Spatial patterns matter
4. **Prioritize equity** - Focus on underserved areas
5. **Think long-term** - Climate adaptation horizon: 20-50 years

---

## 🆘 Troubleshooting

**Q: Map not showing visualizations?**
A: Check browser console for API errors, verify tool outputs contain coordinates

**Q: Satellite imagery not loading?**
A: Image may not exist for exact date/location, try nearby date or larger area

**Q: AI response too general?**
A: Provide specific lat/lon coordinates and detailed context

**Q: Disaster data not showing?**
A: Adjust bounding box to cover your region, check if events are active

---

## 🌟 Future Enhancements

- Real-time weather integration
- Population density overlays
- Traffic flow analysis
- 3D building models
- Time-series animations
- Collaborative planning sessions
- Report generation
- Policy recommendation engine

---

**Built for urban planners, powered by NASA, visualized with deck.gl** 🌍🛰️

