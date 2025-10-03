# Oasis Platform - Climate-Resilient Urban Planning

The Oasis Platform is a globally-scalable, AI-driven digital ecosystem designed to empower humanity's transition to climate-resilient, equitable, and thriving urban environments. This is a Next.js MVP webapp showcasing the frontend dashboard experience.

## 🌍 Vision

Oasis is not merely a mapping tool; it is the central nervous system for the city of the future. It democratizes urban planning by translating complex Earth science into actionable, collaborative intelligence. Our mission is to give every city leader, planner, and citizen the power to see the future of their city and actively shape it for the better.

### The "Digital Covalent Bond" Philosophy

The core innovation of the Oasis Platform is what we call the "Digital Covalent Bond." For decades, urban planning has suffered from a fundamental disconnect: the top-down data of scientists and policymakers rarely bonds with the bottom-up, lived experience of community members. One has scale but lacks granularity; the other has authenticity but lacks scale.

Oasis is designed to be this bond. It forges a shared, trusted reality where a satellite's view of a heat island is seamlessly layered with a grandmother's story of an unbearable summer afternoon. Where a city's flood model is validated by a citizen's smartphone photo of a flooded street. This is not just data fusion; it's empathy fusion. By creating this bond, we move from planning for cities to co-creating with them.

## ✨ Features

### 🏛️ Dashboard (Professional View)
- **AI Chief of Staff**: Natural language interface for data-driven decision making with predictive insights
- **Climate Overview**: Real-time temperature trends, precipitation patterns, and risk assessments
- **Interactive Leaflet Maps**: Multi-layer visualization with heat islands, green cover, flood risk, and infrastructure
- **Advanced Data Layers**: Acoustic, mobility/traffic, and micro-climate wind flow modeling
- **Cascading Effects Simulation**: Advanced modeling showing second and third-order consequences
- **Metrics Grid**: Track climate resilience scores, green coverage, and ROI metrics
- **Project Management**: Manage and track climate resilience initiatives
- **Field Operations**: Mobile companion app integration for real-world implementation

### 👥 Community Portal
- **Civic Garden Initiative**: Gamified engagement where community members earn and plant "seeds" on proposals
- **Community Feed**: Browse proposals, updates, and issues from residents
- **Proposal Creation**: Use storytelling tools to rally community support
- **Campaign Management**: Join ongoing community climate efforts
- **Citizen Engagement**: Plant seeds, verify reports, and build collective impact
- **Ground-Truthing System**: Validate community reports with location tagging and verification

### 🔧 Core Workflow: Analyze → Simulate → Predict
1. **Analyze**: Data fusion from NASA satellites, local sensors, and socio-economic data
2. **Simulate**: Parametric design tools with intervention library and budget constraints
3. **Predict**: Multi-dimensional impact analysis through 2050 with IPCC climate models

## 🎭 User Personas

The platform serves three key user types:

### 👩‍💼 Farah, The Urban Planner
- Advanced simulation tools and technical data export
- High-fidelity modeling with multiple climate scenarios
- Integration with existing CAD/GIS software

### 🏛️ Mayor Rahman, The City Leader  
- Executive dashboard with AI Chief of Staff for predictive decision-making
- Budget impact analysis with natural language query capabilities
- ROI metrics and presentation-ready visualizations
- Public sentiment tracking and policy recommendations
- Cascading effects modeling for comprehensive impact assessment

### 👩‍🏫 Anika, The Community Advocate
- Civic Garden seed economy for gamified community engagement
- Simplified storytelling tools for community engagement
- Ground-truthing network for validating local reports
- Platform for gathering citizen feedback and building consensus
- Compelling visuals to rally support for green initiatives

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd oasis-planner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations and micro-interactions
- **Lucide React** - Beautiful iconography
- **Recharts** - Data visualization and charts

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Shadcn/UI** - Modern component library
- **Class Variance Authority** - Component variants

### State Management
- **Zustand** - Lightweight state management
- **React Hooks** - Built-in state management

### Future Backend Architecture
- **Python (FastAPI)** - Data processing and AI model serving
- **Node.js (NestJS)** - Authentication and API gateway
- **PostgreSQL + PostGIS** - Geospatial database
- **Mapbox GL JS** - High-performance mapping

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Professional dashboard
│   ├── community/         # Community portal
│   └── page.js           # Landing page
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── ClimateOverview.jsx
│   │   ├── InteractiveMap.jsx
│   │   ├── MetricsGrid.jsx
│   │   └── SimulationPanel.jsx
│   └── ui/               # Reusable UI components
├── lib/
│   ├── store.js          # Zustand global state
│   └── utils.js          # Utility functions
└── styles/
    └── globals.css       # Global styles and animations
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald (climate action) → Blue (water/sky)
- **Secondary**: Purple (community) → Pink (engagement)
- **Accent**: Orange (alerts/heat) → Yellow (caution)

### Typography
- **Primary**: Geist Sans (modern, clean)
- **Mono**: Geist Mono (code, data)

### Design Principles
- **Glassmorphism**: Subtle transparency and blur effects
- **Aurora Gradients**: Dynamic, animated background patterns
- **Climate Pulse**: Breathing animations for live data
- **Accessible First**: WCAG 2.1 AA compliance

## 🔮 Future Enhancements

### Digital Twin & Field Integration
- [x] **Oasis Field Ops Companion App**: Mobile AR app demo for city workers
- [ ] **AR Project Overlay**: Full augmented reality visualization of proposed projects
- [ ] **Smart Asset Management**: IoT-enabled tracking of planted trees and green infrastructure
- [ ] **Automated Verification**: Drone and satellite verification of project completion

### Advanced AI & Simulation
- [x] **AI Chief of Staff**: LLM-powered executive advisory system
- [x] **Cascading Effects Model**: Predict second and third-order consequences
- [x] **Empathy Fusion Engine**: Layer quantitative data with qualitative community stories
- [ ] **Environmental Justice AI**: Proactive identification of underserved areas

### Enhanced Data Layers
- [x] **Acoustic Data Layer**: Urban noise pollution mapping and mitigation
- [x] **Mobility/Traffic Integration**: Public transit and traffic flow simulation
- [x] **Micro-Climate Wind Flow**: CFD modeling for urban wind patterns
- [ ] **Real-time Air Quality**: Integration with local sensor networks

### Civic Garden Gamification
- [x] **Seed Economy**: Platform currency for community engagement
- [x] **Growth Visualization**: Project progress meters from seedling to tree
- [x] **Ground-Truthing Network**: Community verification system
- [ ] **Educational Modules**: Interactive learning about climate solutions

### Backend Integration
- [ ] Real NASA Earthdata API integration
- [ ] AI model serving for climate predictions
- [ ] User authentication and authorization
- [ ] Real-time collaboration features

### Advanced Features
- [ ] Mapbox integration for real mapping
- [ ] 3D terrain visualization
- [ ] VR/AR planning tools
- [ ] Mobile app companion

### AI & Machine Learning
- [ ] Convolutional Neural Networks for image analysis
- [ ] Graph Neural Networks for infrastructure modeling
- [ ] Natural language processing for community feedback
- [x] CFD for wind modeling and LLM-based advisory agents
- [ ] Predictive modeling with ensemble methods

## 🤝 Contributing

We welcome contributions from urban planners, developers, climate scientists, and community advocates. Please read our contributing guidelines and code of conduct.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌱 Environmental Impact

This platform is designed to accelerate climate action in cities worldwide. Every feature is built with the goal of reducing urban heat islands, improving flood resilience, and creating more equitable access to green spaces.

---

*"The best time to plant a tree was 20 years ago. The second best time is now."* - Chinese Proverb

Built with 💚 for a climate-resilient future.
