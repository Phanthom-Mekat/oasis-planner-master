'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/mapbox';
import { ColumnLayer, ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { LightingEffect, AmbientLight, _SunLight as SunLight } from '@deck.gl/core';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxlY3RyMCIsImEiOiJjbWc5azF3a3owamVvMmpzOHFsMHljem5qIn0.rpjeucjo4H9UArQn-oBSAA';

const INITIAL_VIEW_STATE = {
  longitude: 90.4125,
  latitude: 23.8103,
  zoom: 12.8,
  pitch: 70,
  bearing: -25,
  maxZoom: 20,
  minZoom: 8,
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Major Rivers and Water Bodies in Dhaka
const DHAKA_RIVERS = [
  {
    name: 'Buriganga River',
    path: [
      [90.3500, 23.7000], [90.3650, 23.7050], [90.3800, 23.7100],
      [90.3950, 23.7120], [90.4100, 23.7150], [90.4250, 23.7180],
      [90.4400, 23.7200], [90.4550, 23.7220]
    ],
    pollutionLevel: 185, // BOD mg/L (Biochemical Oxygen Demand)
    status: 'Critical',
    mainPollutants: ['Industrial waste', 'Sewage', 'Solid waste'],
    treatmentNeeded: 'Immediate',
    color: [220, 20, 60, 200]
  },
  {
    name: 'Turag River',
    path: [
      [90.3600, 23.8500], [90.3650, 23.8300], [90.3700, 23.8100],
      [90.3750, 23.7900], [90.3800, 23.7700], [90.3850, 23.7500]
    ],
    pollutionLevel: 165,
    status: 'Critical',
    mainPollutants: ['Tannery waste', 'Industrial effluent', 'Domestic sewage'],
    treatmentNeeded: 'Urgent',
    color: [200, 40, 80, 200]
  },
  {
    name: 'Balu River',
    path: [
      [90.4800, 23.8200], [90.4750, 23.8000], [90.4700, 23.7800],
      [90.4650, 23.7600], [90.4600, 23.7400], [90.4550, 23.7200]
    ],
    pollutionLevel: 145,
    status: 'Severe',
    mainPollutants: ['Agricultural runoff', 'Urban waste', 'Industrial discharge'],
    treatmentNeeded: 'High Priority',
    color: [180, 60, 100, 200]
  },
  {
    name: 'Tongi Khal',
    path: [
      [90.3900, 23.8800], [90.3950, 23.8600], [90.4000, 23.8400],
      [90.4050, 23.8200], [90.4100, 23.8000]
    ],
    pollutionLevel: 125,
    status: 'Polluted',
    mainPollutants: ['Industrial waste', 'Municipal sewage'],
    treatmentNeeded: 'Priority',
    color: [160, 80, 120, 180]
  },
  {
    name: 'Shitalakshya River',
    path: [
      [90.5200, 23.8000], [90.5100, 23.7800], [90.5000, 23.7600],
      [90.4900, 23.7400], [90.4800, 23.7200]
    ],
    pollutionLevel: 95,
    status: 'Moderate',
    mainPollutants: ['Urban runoff', 'Shipping waste'],
    treatmentNeeded: 'Medium',
    color: [140, 100, 140, 160]
  }
];

// Water Treatment Facilities and Catchments
const WATER_CATCHMENTS = [
  {
    name: 'Buriganga Catchment',
    center: [90.4000, 23.7150],
    radius: 0.08,
    population: 4500000,
    treatmentCapacity: '35%',
    priority: 'Critical',
    strategies: [
      'Build 3 new wastewater treatment plants',
      'Restore riparian buffer zones (500m width)',
      'Relocate tanneries and enforce regulations',
      'Install floating trash barriers',
      'Community-based monitoring program'
    ]
  },
  {
    name: 'Turag Catchment',
    center: [90.3700, 23.8000],
    radius: 0.06,
    population: 2800000,
    treatmentCapacity: '28%',
    priority: 'Critical',
    strategies: [
      'Upgrade existing treatment plants',
      'Plant native vegetation (Hijal, Koroch) along banks',
      'Enforce industrial discharge standards',
      'Construct wetland filtration systems'
    ]
  },
  {
    name: 'Balu Catchment',
    center: [90.4650, 23.7800],
    radius: 0.05,
    population: 1900000,
    treatmentCapacity: '42%',
    priority: 'High',
    strategies: [
      'Agricultural runoff management',
      'Riparian vegetation restoration',
      'Community water quality monitoring',
      'Eco-tourism development for funding'
    ]
  },
  {
    name: 'Eastern Dhaka Catchment',
    center: [90.4400, 23.7500],
    radius: 0.04,
    population: 1200000,
    treatmentCapacity: '55%',
    priority: 'Medium',
    strategies: [
      'Maintain existing treatment infrastructure',
      'Prevent urban encroachment',
      'Regular dredging operations'
    ]
  }
];

// High-Exposure Communities (Air + Water overlap)
const HIGH_EXPOSURE_ZONES = [
  {
    name: 'Hazaribagh (Tannery Area)',
    center: [90.3650, 23.7250],
    airPollution: 175, // NO₂
    waterPollution: 195, // BOD
    population: 185000,
    vulnerableGroups: ['Children under 5', 'Elderly', 'Pregnant women'],
    healthImpact: 'Severe respiratory and waterborne diseases',
    urgency: 'IMMEDIATE',
    interventions: [
      '🏥 Establish health screening camps',
      '🌳 Green buffer with air-purifying trees',
      '💧 Emergency clean water supply',
      '🚦 Reroute heavy traffic',
      '🏭 Relocate polluting industries',
      '🎓 Community health education programs'
    ]
  },
  {
    name: 'Tejgaon Industrial',
    center: [90.3977, 23.7640],
    airPollution: 165,
    waterPollution: 155,
    population: 155000,
    vulnerableGroups: ['Industrial workers', 'Slum dwellers'],
    healthImpact: 'High respiratory illness, contaminated water',
    urgency: 'CRITICAL',
    interventions: [
      '⚙️ Mandatory emission controls',
      '🌱 Industrial green belts',
      '🚰 Separate industrial/domestic water',
      '📊 Real-time monitoring stations'
    ]
  },
  {
    name: 'Kamrangirchar',
    center: [90.3580, 23.7180],
    airPollution: 145,
    waterPollution: 185,
    population: 420000,
    vulnerableGroups: ['Slum population', 'River workers'],
    healthImpact: 'Waterborne diseases, respiratory issues',
    urgency: 'URGENT',
    interventions: [
      '💉 Mass vaccination programs',
      '🏗️ Improved sanitation infrastructure',
      '🌊 Riparian restoration',
      '🚌 Better public transport'
    ]
  },
  {
    name: 'Mirpur-Pallabi',
    center: [90.3684, 23.8065],
    airPollution: 155,
    waterPollution: 135,
    population: 385000,
    vulnerableGroups: ['Dense urban population'],
    healthImpact: 'Moderate air and water contamination',
    urgency: 'HIGH',
    interventions: [
      '🚴 Cycling infrastructure',
      '🌳 Urban forest development',
      '💧 Decentralized treatment plants'
    ]
  }
];

const FAMOUS_LOCATIONS = [
  // Landmarks & Government
  { name: 'Shahbagh', lat: 23.7389, lon: 90.3958, type: 'landmark', emoji: '🏛️', population: 'High' },
  { name: 'National Parliament', lat: 23.7629, lon: 90.3755, type: 'government', emoji: '🏛️', population: 'Medium' },
  { name: 'Bangabandhu Memorial', lat: 23.7462, lon: 90.3742, type: 'landmark', emoji: '🏛️', population: 'High' },
  { name: 'Ahsan Manzil', lat: 23.7081, lon: 90.4066, type: 'landmark', emoji: '🏰', population: 'Medium' },
  { name: 'Lalbagh Fort', lat: 23.7188, lon: 90.3867, type: 'landmark', emoji: '🏰', population: 'Medium' },
  
  // Education
  { name: 'Dhaka University', lat: 23.7308, lon: 90.3978, type: 'education', emoji: '🎓', population: 'Very High' },
  { name: 'BUET', lat: 23.7263, lon: 90.3925, type: 'education', emoji: '🎓', population: 'High' },
  { name: 'Dhaka Medical College', lat: 23.7264, lon: 90.3980, type: 'education', emoji: '🏥', population: 'High' },
  { name: 'North South University', lat: 23.8128, lon: 90.4253, type: 'education', emoji: '🎓', population: 'High' },
  { name: 'IUB', lat: 23.7508, lon: 90.3776, type: 'education', emoji: '🎓', population: 'Medium' },
  
  // Parks & Recreation
  { name: 'Ramna Park', lat: 23.7367, lon: 90.4046, type: 'park', emoji: '🌳', population: 'High' },
  { name: 'Suhrawardy Udyan', lat: 23.7356, lon: 90.4032, type: 'park', emoji: '🌳', population: 'Medium' },
  { name: 'Crescent Lake', lat: 23.8097, lon: 90.4253, type: 'park', emoji: '🌊', population: 'Medium' },
  { name: 'Hatirjheel', lat: 23.7532, lon: 90.4050, type: 'park', emoji: '🌊', population: 'High' },
  { name: 'Botanical Garden', lat: 23.8078, lon: 90.3656, type: 'park', emoji: '🌳', population: 'Low' },
  
  // Residential Areas
  { name: 'Gulshan', lat: 23.7806, lon: 90.4149, type: 'residential', emoji: '🏢', population: 'Very High' },
  { name: 'Banani', lat: 23.7937, lon: 90.4066, type: 'residential', emoji: '🏢', population: 'Very High' },
  { name: 'Dhanmondi', lat: 23.7461, lon: 90.3742, type: 'residential', emoji: '🏘️', population: 'Very High' },
  { name: 'Uttara', lat: 23.8607, lon: 90.3797, type: 'residential', emoji: '🏘️', population: 'Very High' },
  { name: 'Mirpur', lat: 23.8065, lon: 90.3684, type: 'residential', emoji: '🏘️', population: 'Very High' },
  { name: 'Bashundhara', lat: 23.8223, lon: 90.4254, type: 'residential', emoji: '🏢', population: 'Very High' },
  { name: 'Badda', lat: 23.7806, lon: 90.4254, type: 'residential', emoji: '🏘️', population: 'High' },
  { name: 'Mohammadpur', lat: 23.7654, lon: 90.3563, type: 'residential', emoji: '🏘️', population: 'Very High' },
  
  // Business & Commercial
  { name: 'Motijheel', lat: 23.7336, lon: 90.4172, type: 'business', emoji: '💼', population: 'Very High' },
  { name: 'Kawran Bazar', lat: 23.7506, lon: 90.3936, type: 'market', emoji: '🏪', population: 'Very High' },
  { name: 'New Market', lat: 23.7343, lon: 90.3854, type: 'market', emoji: '🛍️', population: 'Very High' },
  { name: 'Bashundhara City', lat: 23.7506, lon: 90.3907, type: 'mall', emoji: '🏬', population: 'Very High' },
  { name: 'Jamuna Future Park', lat: 23.8105, lon: 90.4251, type: 'mall', emoji: '🏬', population: 'Very High' },
  { name: 'Farmgate', lat: 23.7576, lon: 90.3897, type: 'business', emoji: '💼', population: 'Very High' },
  
  // Transportation
  { name: 'Hazrat Shahjalal Airport', lat: 23.8433, lon: 90.3978, type: 'airport', emoji: '✈️', population: 'High' },
  { name: 'Kamalapur Station', lat: 23.7307, lon: 90.4262, type: 'transport', emoji: '🚂', population: 'Very High' },
  { name: 'Sadarghat', lat: 23.7108, lon: 90.4111, type: 'port', emoji: '⚓', population: 'High' },
  { name: 'Gabtoli Bus Terminal', lat: 23.7762, lon: 90.3473, type: 'transport', emoji: '🚌', population: 'Very High' },
  
  // Religious Sites
  { name: 'Baitul Mukarram', lat: 23.7343, lon: 90.4096, type: 'religious', emoji: '🕌', population: 'High' },
  { name: 'Dhakeshwari Temple', lat: 23.7227, lon: 90.3863, type: 'religious', emoji: '🛕', population: 'Medium' },
  { name: 'Armenian Church', lat: 23.7148, lon: 90.4070, type: 'religious', emoji: '⛪', population: 'Low' },
  
  // Healthcare
  { name: 'Bangabandhu Hospital', lat: 23.7262, lon: 90.3979, type: 'hospital', emoji: '🏥', population: 'High' },
  { name: 'Square Hospital', lat: 23.7518, lon: 90.3879, type: 'hospital', emoji: '�', population: 'High' },
  { name: 'United Hospital', lat: 23.8094, lon: 90.4241, type: 'hospital', emoji: '🏥', population: 'High' },
  
  // Industrial
  { name: 'Tejgaon Industrial', lat: 23.7640, lon: 90.3977, type: 'industrial', emoji: '🏭', population: 'Medium' },
  { name: 'Tongi Industrial', lat: 23.8931, lon: 90.4057, type: 'industrial', emoji: '�', population: 'Medium' },
];

const getMitigationStrategy = (concentration, source, population) => {
  const strategies = [];
  
  // Air Quality Strategies
  if (concentration > 150) {
    strategies.push('🚨 CRITICAL: Immediate intervention required');
    strategies.push('🌳 Plant dense green buffers (bamboo, neem trees)');
    strategies.push('🚦 Implement traffic rerouting and congestion pricing');
    strategies.push('🏭 Enforce stricter industrial emission controls');
    strategies.push('👥 Issue public health advisory for vulnerable groups');
  } else if (concentration > 100) {
    strategies.push('⚠️ HIGH: Enhanced monitoring needed');
    strategies.push('🌱 Establish green corridors along major roads');
    strategies.push('🚗 Promote electric vehicle adoption');
    strategies.push('🏭 Regular industrial emission audits');
    strategies.push('💨 Install air purifiers in public spaces');
  } else if (concentration > 60) {
    strategies.push('⚡ MODERATE: Preventive measures recommended');
    strategies.push('🌿 Increase urban forestry programs');
    strategies.push('🚴 Develop cycling infrastructure');
    strategies.push('📊 Deploy low-cost air quality sensors');
  } else {
    strategies.push('✅ GOOD: Maintain current practices');
    strategies.push('🌳 Continue vegetation maintenance');
    strategies.push('📈 Monitor for seasonal variations');
  }
  
  // Population-based strategies
  if (population === 'Very High' || population === 'High') {
    strategies.push('👨‍👩‍👧‍👦 High-exposure community identified');
    strategies.push('🏥 Establish health monitoring stations');
    strategies.push('🎓 Launch public awareness campaigns');
  }
  
  // Source-specific strategies
  if (source.includes('Industrial') || source.includes('Manufacturing')) {
    strategies.push('🔬 Install CEMS (Continuous Emission Monitoring)');
    strategies.push('⚙️ Mandate scrubbers and filters');
  } else if (source.includes('Traffic')) {
    strategies.push('🚦 Optimize traffic signal timing');
    strategies.push('🚌 Expand public transport network');
  } else if (source.includes('Power Plant')) {
    strategies.push('⚡ Transition to cleaner fuel sources');
    strategies.push('🔋 Invest in renewable energy');
  }
  
  // Water quality strategies
  strategies.push('💧 WATER: Monitor riparian zones');
  strategies.push('🌊 Restore wetland buffer vegetation');
  strategies.push('🚰 Upgrade wastewater treatment capacity');
  
  return strategies;
};

const getSeasonalData = (dayOfYear) => {
  const season = {
    winter: dayOfYear < 90 || dayOfYear > 335,
    summer: dayOfYear >= 90 && dayOfYear < 180,
    monsoon: dayOfYear >= 180 && dayOfYear < 275,
    autumn: dayOfYear >= 275 && dayOfYear <= 335,
  };
  
  let multiplier = 1.0;
  let fogColor = '#1a1a2e';
  let seasonName = '';
  let emoji = '';
  
  if (season.winter) {
    multiplier = 2.2;
    fogColor = '#3a2a1e';
    seasonName = 'Winter';
    emoji = '';
  } else if (season.autumn) {
    multiplier = 1.8;
    fogColor = '#2a2a3e';
    seasonName = 'Autumn';
    emoji = '';
  } else if (season.summer) {
    multiplier = 1.3;
    fogColor = '#2e2a1a';
    seasonName = 'Summer';
    emoji = '';
  } else if (season.monsoon) {
    multiplier = 0.5;
    fogColor = '#1a2a3e';
    seasonName = 'Monsoon';
    emoji = '';
  }
  
  return { multiplier, fogColor, seasonName, emoji };
};

const generatePollutionData = (time, dayOfYear) => {
  const points = [];
  const centerLat = 23.8103;
  const centerLon = 90.4125;
  
  const { multiplier } = getSeasonalData(dayOfYear);
  
  const hotspots = [
    { lat: centerLat + 0.03, lon: centerLon - 0.025, base: 160, name: 'Industrial Zone', color: [255, 60, 30] },
    { lat: centerLat - 0.02, lon: centerLon + 0.03, base: 140, name: 'Traffic Hub', color: [255, 140, 0] },
    { lat: centerLat + 0.022, lon: centerLon + 0.022, base: 150, name: 'Manufacturing', color: [255, 80, 40] },
    { lat: centerLat - 0.032, lon: centerLon - 0.018, base: 110, name: 'Urban Center', color: [255, 180, 60] },
    { lat: centerLat + 0.008, lon: centerLon - 0.035, base: 130, name: 'Power Plant', color: [200, 50, 50] },
  ];
  
  hotspots.forEach((hotspot, idx) => {
    const pulse = Math.sin(time * 0.55 + idx * 1.4) * 0.35 + 0.65;
    const spread = Math.cos(time * 0.35 + idx * 0.75) * 0.28 + 0.72;
    
    for (let i = 0; i < 60; i++) { // Reduced from 70 to 60 for performance
      const angle = (i / 60) * Math.PI * 2 + time * 0.075;
      const distance = (Math.random() * 0.014 + 0.0035) * pulse;
      
      const concentration = Math.max(
        20,
        hotspot.base * multiplier * (1 - distance * 28) * spread + 
        Math.sin(time * 2.8 + i * 0.18) * 14
      );
      
      points.push({
        position: [
          hotspot.lon + Math.cos(angle) * distance,
          hotspot.lat + Math.sin(angle) * distance,
        ],
        concentration,
        source: hotspot.name,
        baseColor: hotspot.color,
        timestamp: new Date().toISOString(),
        pollutantType: 'NO₂',
        particulateMatter: Math.round(concentration * 0.6),
        coLevel: Math.round(concentration * 0.3),
        windSpeed: (Math.random() * 3 + 1).toFixed(1),
        humidity: Math.round(Math.random() * 30 + 50),
        temperature: Math.round(Math.random() * 10 + 20),
      });
    }
  });
  
  for (let i = 0; i < 100; i++) { // Reduced from 120 to 100
    const drift = time * 0.00018;
    points.push({
      position: [
        centerLon + (Math.random() - 0.5) * 0.085 + drift,
        centerLat + (Math.random() - 0.5) * 0.085,
      ],
      concentration: Math.random() * 48 + 15,
      source: 'Ambient',
      baseColor: [195, 175, 95],
      timestamp: new Date().toISOString(),
      pollutantType: 'NO₂',
      particulateMatter: Math.round(Math.random() * 30 + 10),
      coLevel: Math.round(Math.random() * 15 + 5),
      windSpeed: (Math.random() * 2 + 0.5).toFixed(1),
      humidity: Math.round(Math.random() * 25 + 55),
      temperature: Math.round(Math.random() * 8 + 22),
    });
  }
  
  return points;
};

const generateParticles = (time, dayOfYear) => {
  const particles = [];
  const { multiplier } = getSeasonalData(dayOfYear);
  const count = Math.floor(100 * Math.min(multiplier, 1.5)); // Reduced count, cap multiplier
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 0.032 + Math.random() * 0.02;
    const height = Math.sin(time * 0.35 + i * 0.12) * 0.35 + 0.6;
    const speed = 0.1 * (1 / Math.min(multiplier, 1.5));
    
    particles.push({
      position: [
        90.4125 + Math.cos(angle + time * speed) * radius,
        23.8103 + Math.sin(angle + time * speed) * radius,
      ],
      size: Math.random() * 90 + 45,
      opacity: height * 0.45 + 0.3,
    });
  }
  
  return particles;
};

const generatePollutionPaths = (time) => {
  const paths = [];
  const sources = [
    { lon: 90.39, lat: 23.82, angle: 45 },
    { lon: 90.44, lat: 23.80, angle: 135 },
    { lon: 90.41, lat: 23.84, angle: 225 },
  ];
  
  sources.forEach((source, idx) => {
    const path = [];
    const baseAngle = (source.angle + time * 10) * (Math.PI / 180);
    
    for (let i = 0; i < 15; i++) {
      const t = i / 15;
      const dist = t * 0.03;
      path.push([
        source.lon + Math.cos(baseAngle) * dist,
        source.lat + Math.sin(baseAngle) * dist,
      ]);
    }
    
    paths.push({
      path,
      intensity: Math.sin(time + idx) * 0.3 + 0.7,
    });
  });
  
  return paths;
};

export default function DeckGLPollutionMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [time, setTime] = useState(0);
  const [dayOfYear, setDayOfYear] = useState(15);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [showParticles, setShowParticles] = useState(true);
  const [show3DColumns, setShow3DColumns] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPollutionPoint, setSelectedPollutionPoint] = useState(null);
  const [showWaterQuality, setShowWaterQuality] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showCatchments, setShowCatchments] = useState(true);
  const [showHighExposureZones, setShowHighExposureZones] = useState(true);
  const [selectedRiver, setSelectedRiver] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [visualMode, setVisualMode] = useState('dual'); // 'air', 'water', 'dual'
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setTime(t => t + 0.016);
      setDayOfYear(d => {
        const newDay = d + (speed * 0.016 / 2);
        return newDay > 365 ? 1 : newDay;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  const pollutionData = useMemo(() => generatePollutionData(time, dayOfYear), [time, dayOfYear]);
  const particleData = useMemo(() => generateParticles(time, dayOfYear), [time, dayOfYear]);
  const pollutionPaths = useMemo(() => generatePollutionPaths(time), [time]);
  const seasonalData = useMemo(() => getSeasonalData(Math.floor(dayOfYear)), [dayOfYear]);

  const lightingEffect = useMemo(() => {
    const hour = (dayOfYear % 1) * 24;
    
    return new LightingEffect({
      ambient: new AmbientLight({
        color: [255, 255, 255],
        intensity: 1.8,
      }),
      sun: new SunLight({
        timestamp: Date.UTC(2024, 0, Math.floor(dayOfYear), hour),
        color: [255, 240, 220],
        intensity: 3.0,
      }),
    });
  }, [dayOfYear]);

  const layers = useMemo(() => {
    const result = [];

    // Optimize: Only render air columns in air or dual mode
    if (show3DColumns && (visualMode === 'air' || visualMode === 'dual')) {
      result.push(
        new ColumnLayer({
          id: 'pollution-columns',
          data: pollutionData,
          diskResolution: 24, // Reduced from 32 for better performance
          radius: 280, // Slightly smaller for cleaner look
          extruded: true,
          pickable: true,
          elevationScale: 140,
          getPosition: d => d.position,
          getFillColor: d => {
            const level = d.concentration;
            const pulse = Math.sin(time * 4 + d.position[0] * 80) * 30;
            const glow = Math.sin(time * 2.5) * 15;
            
            if (level > 180) {
              return [
                Math.min(255, 240 + pulse),
                Math.max(0, 25 + glow),
                Math.max(0, 30 + glow),
                240
              ];
            }
            if (level > 120) {
              return [
                Math.min(255, 255 + pulse * 0.6),
                Math.min(255, 90 + glow + pulse * 0.25),
                Math.max(0, 25 + glow),
                220
              ];
            }
            if (level > 80) {
              return [
                Math.min(255, 250 + pulse * 0.4),
                Math.min(255, 190 + glow),
                Math.min(255, 50 + pulse * 0.25),
                200
              ];
            }
            return [
              Math.max(0, 70 + glow),
              Math.min(255, 210 + pulse * 0.3),
              Math.min(255, 130 + glow),
              180
            ];
          },
          getLineColor: d => {
            const shimmer = Math.sin(time * 5 + d.position[0] * 150) * 40 + 200;
            return [shimmer, shimmer, 255, 180];
          },
          getLineWidth: 2,
          getElevation: d => {
            const wave = Math.sin(time * 1.8 + d.position[0] * 40) * 0.12 + 0.88;
            return Math.pow(d.concentration, 1.35) * 38 * wave;
          },
          updateTriggers: {
            getFillColor: time,
            getElevation: [time, dayOfYear],
            getLineColor: time,
          },
          onClick: (info) => {
            if (info.object) {
              setSelectedPollutionPoint(info.object);
            }
          },
        })
      );
    }

    // Optimize: Only render heatmap in air or dual mode
    if (visualMode === 'air' || visualMode === 'dual') {
      result.push(
        new HeatmapLayer({
          id: 'pollution-heatmap',
          data: pollutionData,
          getPosition: d => d.position,
          getWeight: d => d.concentration,
          radiusPixels: 120, // Reduced for cleaner look
          intensity: 2.4,
          threshold: 0.03,
          colorRange: [
            [30, 255, 140, 0],
            [90, 255, 110, 120],
            [255, 250, 0, 170],
            [255, 170, 0, 230],
            [255, 90, 40, 255],
            [210, 25, 25, 255],
          ],
          updateTriggers: {
            getWeight: [time, dayOfYear],
          },
        })
      );

      result.push(
        new HexagonLayer({
          id: 'pollution-hexagons',
          data: pollutionData,
          pickable: true,
          extruded: true,
          radius: 380,
          elevationScale: 45,
          getPosition: d => d.position,
          opacity: 0.3,
          colorRange: [
            [45, 185, 105],
            [150, 215, 125],
            [225, 240, 145],
            [255, 225, 145],
            [255, 165, 95],
            [235, 60, 40],
          ],
          updateTriggers: {
            getPosition: [time, dayOfYear],
          },
        })
      );
    }

    // Optimize: Only render wind paths in air or dual mode
    if (showPaths && (visualMode === 'air' || visualMode === 'dual')) {
      pollutionPaths.forEach((pathData, idx) => {
        result.push(
          new PathLayer({
            id: `pollution-path-${idx}`,
            data: [pathData],
            pickable: false,
            widthScale: 18,
            widthMinPixels: 2,
            getPath: d => d.path,
            getColor: d => [255, 140, 45, d.intensity * 160],
            getWidth: d => d.intensity * 7,
            updateTriggers: {
              getColor: time,
              getWidth: time,
            },
          })
        );
      });
    }

    // Water Quality - Rivers with animated flow
    if ((visualMode === 'water' || visualMode === 'dual') && showRivers) {
      DHAKA_RIVERS.forEach((river, idx) => {
        const flowAnimation = Math.sin(time * 2 + idx) * 0.3 + 0.7;
        const pollutionPulse = Math.sin(time * 3 + idx * 0.5) * 30;
        
        result.push(
          new PathLayer({
            id: `river-${idx}`,
            data: [river],
            pickable: true,
            widthScale: 1,
            widthMinPixels: 8,
            widthMaxPixels: 25,
            jointRounded: true,
            capRounded: true,
            getPath: d => d.path,
            getColor: d => [
              Math.min(255, d.color[0] + pollutionPulse),
              Math.max(0, d.color[1] - pollutionPulse),
              Math.max(0, d.color[2] - pollutionPulse),
              d.color[3] * flowAnimation
            ],
            getWidth: d => (d.pollutionLevel / 10) * flowAnimation,
            onClick: (info) => {
              if (info.object) {
                setSelectedRiver(info.object);
              }
            },
            updateTriggers: {
              getColor: time,
              getWidth: time,
            },
          })
        );

        // Add water flow particles along river - optimized, fewer particles
        const flowParticles = river.path.filter((_, pIdx) => pIdx % 2 === 0).map((point, pIdx) => ({
          position: [
            point[0] + Math.sin(time * 1.8 + pIdx * 0.45) * 0.0018,
            point[1] + Math.cos(time * 1.8 + pIdx * 0.45) * 0.0018
          ],
          size: 28 + Math.sin(time * 2.7 + pIdx) * 13,
          color: river.status === 'Critical' ? [255, 95, 95, 170] : [95, 145, 255, 145]
        }));

        result.push(
          new ScatterplotLayer({
            id: `river-flow-${idx}`,
            data: flowParticles,
            pickable: false,
            opacity: 0.55,
            stroked: true,
            filled: true,
            radiusScale: 1,
            radiusMinPixels: 2,
            radiusMaxPixels: 5,
            lineWidthMinPixels: 1,
            getPosition: d => d.position,
            getRadius: d => d.size,
            getFillColor: d => d.color,
            getLineColor: [255, 255, 255, 90],
            updateTriggers: {
              getPosition: time,
              getRadius: time,
            },
          })
        );
      });
    }

    // Water Catchments - Pulsing circles
    if ((visualMode === 'water' || visualMode === 'dual') && showCatchments) {
      WATER_CATCHMENTS.forEach((catchment, idx) => {
        const pulse = Math.sin(time * 1.5 + idx * 1.2) * 0.15 + 0.85;
        const glow = Math.sin(time * 2 + idx) * 20 + 100;
        
        result.push(
          new ScatterplotLayer({
            id: `catchment-${idx}`,
            data: [catchment],
            pickable: true,
            opacity: 0.25,
            stroked: true,
            filled: true,
            radiusScale: 1,
            lineWidthMinPixels: 3,
            getPosition: d => d.center,
            getRadius: d => d.radius * 111000 * pulse, // Convert to meters
            getFillColor: d => {
              if (d.priority === 'Critical') return [255, 50, 50, 50];
              if (d.priority === 'High') return [255, 150, 50, 40];
              return [100, 200, 255, 30];
            },
            getLineColor: d => {
              if (d.priority === 'Critical') return [255, glow, glow, 200];
              if (d.priority === 'High') return [255, 200, glow, 180];
              return [100, 200, 255, 150];
            },
            getLineWidth: 3,
            updateTriggers: {
              getRadius: time,
              getLineColor: time,
            },
          })
        );
      });
    }

    // High-Exposure Zones - Dual threat indicators
    if (showHighExposureZones) {
      HIGH_EXPOSURE_ZONES.forEach((zone, idx) => {
        const urgencyPulse = Math.sin(time * 4 + idx * 0.8) * 0.4 + 0.6;
        const warningGlow = Math.sin(time * 5 + idx) * 50;
        
        result.push(
          new ScatterplotLayer({
            id: `exposure-zone-${idx}`,
            data: [zone],
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 1,
            radiusMinPixels: 15,
            radiusMaxPixels: 30,
            lineWidthMinPixels: 3,
            getPosition: d => d.center,
            getRadius: 200 * urgencyPulse,
            getFillColor: d => {
              if (d.urgency === 'IMMEDIATE') return [255, 0, 0, 180];
              if (d.urgency === 'CRITICAL') return [255, 100, 0, 160];
              return [255, 150, 0, 140];
            },
            getLineColor: [255, 255 - warningGlow, 255 - warningGlow, 255],
            getLineWidth: 4,
            onClick: (info) => {
              if (info.object) {
                setSelectedZone(info.object);
              }
            },
            updateTriggers: {
              getRadius: time,
              getLineColor: time,
            },
          })
        );

        // Pulsing warning rings
        for (let ring = 0; ring < 3; ring++) {
          const ringPulse = Math.sin(time * 3 - ring * 0.8) * 0.5 + 0.5;
          result.push(
            new ScatterplotLayer({
              id: `exposure-ring-${idx}-${ring}`,
              data: [zone],
              pickable: false,
              opacity: ringPulse * 0.3,
              stroked: true,
              filled: false,
              radiusScale: 1,
              lineWidthMinPixels: 2,
              getPosition: d => d.center,
              getRadius: (300 + ring * 150) * (1 + ringPulse * 0.3),
              getLineColor: [255, 0, 0, ringPulse * 150],
              getLineWidth: 2,
              updateTriggers: {
                getRadius: time,
                getLineColor: time,
              },
            })
          );
        }
      });
    }

    // Optimize: Only render particles in air or dual mode with reduced count
    if (showParticles && (visualMode === 'air' || visualMode === 'dual')) {
      result.push(
        new ScatterplotLayer({
          id: 'floating-particles',
          data: particleData,
          pickable: false,
          opacity: 0.55,
          stroked: true,
          filled: true,
          lineWidthMinPixels: 1,
          radiusScale: 1,
          radiusMinPixels: 2,
          radiusMaxPixels: 10,
          getPosition: d => d.position,
          getRadius: d => d.size,
          getFillColor: d => [255, 215, 110, d.opacity * 180],
          getLineColor: [255, 255, 255, 90],
          updateTriggers: {
            getPosition: [time, dayOfYear],
            getFillColor: [time, dayOfYear],
          },
        })
      );
    }

    if (showLocations) {
      result.push(
        new ScatterplotLayer({
          id: 'location-markers',
          data: FAMOUS_LOCATIONS,
          pickable: true,
          opacity: 0.9,
          stroked: true,
          filled: true,
          radiusScale: 1,
          radiusMinPixels: 8,
          radiusMaxPixels: 20,
          lineWidthMinPixels: 2,
          getPosition: d => [d.lon, d.lat],
          getRadius: 150,
          getFillColor: d => {
            if (selectedLocation && selectedLocation.name === d.name) {
              return [59, 130, 246, 255];
            }
            return [255, 255, 255, 220];
          },
          getLineColor: d => {
            if (selectedLocation && selectedLocation.name === d.name) {
              return [59, 130, 246, 255];
            }
            return [34, 197, 94, 255];
          },
          getLineWidth: 3,
          onClick: (info) => info.object && handleLocationClick(info.object),
          updateTriggers: {
            getFillColor: selectedLocation,
            getLineColor: selectedLocation,
          },
        })
      );
    }

    return result;
  }, [pollutionData, particleData, pollutionPaths, time, dayOfYear, show3DColumns, showParticles, showPaths]);

  const maxConcentration = useMemo(() => {
    if (!pollutionData.length) return 0;
    return Math.max(...pollutionData.map(d => d.concentration));
  }, [pollutionData]);

  const healthStatus = useMemo(() => {
    if (maxConcentration > 180) return { level: 'HAZARDOUS', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    if (maxConcentration > 120) return { level: 'UNHEALTHY', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' };
    if (maxConcentration > 80) return { level: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
    return { level: 'GOOD', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' };
  }, [maxConcentration]);

  const currentMonth = MONTHS[Math.floor((dayOfYear - 1) / 30.4) % 12];
  const currentDay = Math.floor(((dayOfYear - 1) % 30.4) + 1);

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return FAMOUS_LOCATIONS;
    return FAMOUS_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleLocationClick = (location) => {
    setViewState({
      ...viewState,
      longitude: location.lon,
      latitude: location.lat,
      zoom: 14,
      transitionDuration: 1000,
      transitionInterpolator: null,
    });
    setSelectedLocation(location);
  };

  const handleZoomIn = () => {
    setViewState({ ...viewState, zoom: Math.min(viewState.zoom + 1, 20), transitionDuration: 300 });
  };

  const handleZoomOut = () => {
    setViewState({ ...viewState, zoom: Math.max(viewState.zoom - 1, 8), transitionDuration: 300 });
  };

  const handleResetView = () => {
    setViewState({ ...INITIAL_VIEW_STATE, transitionDuration: 1000 });
    setSelectedLocation(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950">
      <DeckGL
        viewState={viewState}
        controller={true}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        effects={[lightingEffect]}
        getTooltip={({ object, layer }) => {
          if (!object) return null;
          
          if (layer && layer.id === 'location-markers') {
            return {
              html: `<div style="padding: 12px; background: rgba(0,0,0,0.95); border-radius: 10px; border: 2px solid rgba(34,197,94,0.6); box-shadow: 0 4px 12px rgba(0,0,0,0.5);"><div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><span style="font-size: 20px;">${object.emoji}</span><strong style="color: #22c55e; font-size: 15px;">${object.name}</strong></div><span style="color: #d1d5db; font-size: 12px; text-transform: capitalize;">📍 ${object.type}</span></div>`,
              style: { fontSize: '12px', pointerEvents: 'none' }
            };
          }
          
          if (object.source) {
            return {
              html: `<div style="padding: 10px; background: rgba(0,0,0,0.9); border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);"><strong style="color: #fbbf24; font-size: 14px;">${object.source}</strong><br/><span style="color: #fff; font-size: 13px;">Concentration: ${Math.round(object.concentration)} μg/m³</span></div>`,
              style: { fontSize: '12px', pointerEvents: 'none' }
            };
          }
          
          return null;
        }}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          terrain={{ source: 'mapbox-dem', exaggeration: 2.0 }}
          fog={{
            range: [0.5, 10],
            color: seasonalData.fogColor,
            'horizon-blend': 0.4,
            'high-color': '#245bde',
            'space-color': '#000000',
            'star-intensity': 0.2
          }}
        />
      </DeckGL>

      {/* Clean Location Banner - Top Center */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-xl border border-white/15 rounded-xl px-5 py-3 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🇧🇩</span>
            <div>
              <p className="text-white text-base font-bold">Dhaka, Bangladesh</p>
              <p className="text-gray-400 text-[10px]">23.8103°N, 90.4125°E • {seasonalData.seasonName} {seasonalData.emoji}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 flex flex-col gap-3 pointer-events-none">
        <div className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl w-80 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               Pollution Monitor
            </h2>
          </div>

          <div className={`${healthStatus.bg} border ${healthStatus.border} rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wide font-semibold">Air Quality</p>
                <p className={`text-xl font-bold ${healthStatus.color}`}>{healthStatus.level}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px] font-semibold">Peak</p>
                <p className="text-white text-2xl font-bold">{Math.round(maxConcentration)}</p>
                <p className="text-gray-500 text-[9px]">μg/m³</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/25 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <p className="text-gray-300 text-[10px] uppercase tracking-wide font-semibold">Season</p>
                <p className="text-white text-sm font-bold">{seasonalData.seasonName}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-[10px] font-semibold">Date</p>
                <p className="text-white text-sm font-bold">{currentMonth} {currentDay}</p>
              </div>
            </div>
            <div className="w-full bg-gray-700/40 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-200 rounded-full"
                style={{ width: `${(dayOfYear / 365) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Year Simulation</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  {isPlaying ? ' Pause' : ' Play'}
                </button>
                <button
                  onClick={() => setDayOfYear(1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-600 hover:bg-gray-700 text-white transition-all"
                >
                   Reset
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 text-xs font-semibold">Speed: {speed}x</label>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Display Layers</p>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">3D Columns</span>
              <input type="checkbox" checked={show3DColumns} onChange={(e) => setShow3DColumns(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Particles</span>
              <input type="checkbox" checked={showParticles} onChange={(e) => setShowParticles(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Wind Paths</span>
              <input type="checkbox" checked={showPaths} onChange={(e) => setShowPaths(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">📍 Locations</span>
              <input type="checkbox" checked={showLocations} onChange={(e) => setShowLocations(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">💧 Rivers</span>
              <input type="checkbox" checked={showRivers} onChange={(e) => setShowRivers(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-cyan-500 checked:to-blue-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">🌊 Catchments</span>
              <input type="checkbox" checked={showCatchments} onChange={(e) => setShowCatchments(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-cyan-500 checked:to-blue-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">⚠️ High-Risk Zones</span>
              <input type="checkbox" checked={showHighExposureZones} onChange={(e) => setShowHighExposureZones(e.target.checked)} className="w-11 h-6 rounded-full appearance-none cursor-pointer bg-gray-700 checked:bg-gradient-to-r checked:from-red-500 checked:to-orange-500 relative before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all before:shadow-lg checked:before:left-5" />
            </label>
          </div>

          {/* Visualization Mode Selector */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Visualization Mode</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setVisualMode('air')}
                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${visualMode === 'air' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'}`}
              >
                🌫️ AIR
              </button>
              <button
                onClick={() => setVisualMode('water')}
                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${visualMode === 'water' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'}`}
              >
                💧 WATER
              </button>
              <button
                onClick={() => setVisualMode('dual')}
                className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${visualMode === 'dual' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'}`}
              >
                ⚡ BOTH
              </button>
            </div>
          </div>
        </div>

        {/* Pollution Levels Legend - Left Side */}
        <div className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl pointer-events-auto">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Pollution Levels (μg/m³)</p>
          <div className="space-y-2.5">
            {[
              { color: 'from-green-500 to-emerald-500', label: 'Good', range: '0-80' },
              { color: 'from-yellow-500 to-amber-500', label: 'Moderate', range: '80-120' },
              { color: 'from-orange-500 to-red-500', label: 'Unhealthy', range: '120-180' },
              { color: 'from-red-500 to-rose-600', label: 'Hazardous', range: '180+' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-10 h-3.5 bg-gradient-to-r ${item.color} rounded-full shadow-lg`} />
                <span className="text-white text-sm font-semibold min-w-[90px]">{item.label}</span>
                <span className="text-gray-400 text-xs">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Locations Panel - Right Side */}
      <div className="absolute top-4 right-4 flex flex-col gap-3 pointer-events-none" style={{ marginTop: '80px' }}>
        <div className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl w-80 pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              🗺️ Explore Locations
              <span className="text-xs text-gray-400 font-normal">({filteredLocations.length} of {FAMOUS_LOCATIONS.length})</span>
            </h3>
            <button
              onClick={handleResetView}
              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 text-xs font-semibold transition-all"
            >
              Reset View
            </button>
          </div>

          <input
            type="text"
            placeholder="Search 50+ Dhaka locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-3"
          />

          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1.5">
            {filteredLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleLocationClick(location)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                  selectedLocation?.name === location.name
                    ? 'bg-blue-500/30 border border-blue-500/50'
                    : 'bg-gray-800/30 hover:bg-gray-700/40 border border-gray-700/50'
                }`}
              >
                <span className="text-xl">{location.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${
                      selectedLocation?.name === location.name ? 'text-blue-400' : 'text-white'
                    }`}>
                      {location.name}
                    </p>
                    {location.population === 'Very High' && (
                      <span className="px-1.5 py-0.5 bg-red-500/30 text-red-400 text-[10px] font-bold rounded">HIGH-EXP</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 capitalize">{location.type} • {location.population} Pop.</p>
                </div>
                <span className="text-gray-500 text-xs">→</span>
              </button>
            ))}
          </div>

          {selectedLocation && (
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedLocation.emoji}</span>
                <p className="text-blue-400 font-semibold text-sm">{selectedLocation.name}</p>
              </div>
              <p className="text-gray-400 text-xs mb-1">
                📍 {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lon.toFixed(4)}°E
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">Population Density:</span>
                <span className={`text-xs font-bold ${
                  selectedLocation.population === 'Very High' ? 'text-red-400' :
                  selectedLocation.population === 'High' ? 'text-orange-400' :
                  selectedLocation.population === 'Medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {selectedLocation.population}
                </span>
              </div>
              <p className="text-gray-500 text-[10px] mt-2 italic">
                💡 Click pollution columns for detailed mitigation strategies
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl pointer-events-auto">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Active Sources</p>
          <p className="text-white text-4xl font-bold">{pollutionData.length}</p>
          <p className="text-gray-500 text-xs mt-1">pollution points</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/40 backdrop-blur-2xl rounded-xl p-4 shadow-2xl pointer-events-auto">
          <p className="text-gray-300 text-xs uppercase tracking-wider font-semibold mb-2">Status</p>
          <p className="text-green-400 text-sm font-bold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50"></span>
            </span>
            LIVE SIMULATION
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 backdrop-blur-2xl rounded-xl p-4 shadow-2xl pointer-events-auto">
          <p className="text-gray-300 text-xs uppercase tracking-wider font-semibold mb-2">Multiplier</p>
          <p className="text-purple-400 text-3xl font-bold">{seasonalData.multiplier.toFixed(1)}x</p>
          <p className="text-gray-400 text-xs mt-1">{seasonalData.seasonName} factor</p>
        </div>

        {/* Visual Mode Indicator */}
        <div className={`backdrop-blur-2xl rounded-xl p-4 shadow-2xl pointer-events-auto border-2 ${
          visualMode === 'air' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/40' :
          visualMode === 'water' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40' :
          'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/40'
        }`}>
          <p className="text-gray-300 text-xs uppercase tracking-wider font-semibold mb-2">Active Mode</p>
          <p className={`text-2xl font-bold ${
            visualMode === 'air' ? 'text-orange-400' :
            visualMode === 'water' ? 'text-cyan-400' :
            'text-purple-400'
          }`}>
            {visualMode === 'air' ? '🌫️ AIR' : visualMode === 'water' ? '💧 WATER' : '⚡ DUAL'}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {visualMode === 'air' ? 'NO₂ & Particulates' : 
             visualMode === 'water' ? 'Rivers & Catchments' : 
             'Air + Water Quality'}
          </p>
        </div>

        {/* High-Risk Alert */}
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 backdrop-blur-2xl rounded-xl p-4 shadow-2xl pointer-events-auto animate-pulse">
          <p className="text-red-300 text-xs uppercase tracking-wider font-semibold mb-2">⚠️ Critical Zones</p>
          <p className="text-white text-3xl font-bold">{HIGH_EXPOSURE_ZONES.length}</p>
          <p className="text-gray-300 text-xs mt-1">
            {HIGH_EXPOSURE_ZONES.reduce((sum, zone) => sum + zone.population, 0).toLocaleString()} people at risk
          </p>
        </div>

        {/* Water Quality Summary */}
        {(visualMode === 'water' || visualMode === 'dual') && (
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 backdrop-blur-2xl rounded-xl p-4 shadow-2xl pointer-events-auto">
            <p className="text-cyan-300 text-xs uppercase tracking-wider font-semibold mb-2">💧 Rivers Monitored</p>
            <p className="text-white text-3xl font-bold">{DHAKA_RIVERS.length}</p>
            <p className="text-gray-300 text-xs mt-1">
              {DHAKA_RIVERS.filter(r => r.status === 'Critical').length} Critical • {DHAKA_RIVERS.filter(r => r.status === 'Severe').length} Severe
            </p>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 flex gap-3 pointer-events-none">
        <button
          onClick={handleZoomOut}
          className="pointer-events-auto w-12 h-12 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl hover:from-black/90 hover:to-black/70 transition-all flex items-center justify-center text-white text-xl font-bold hover:scale-110"
          title="Zoom Out"
        >
          −
        </button>
        <div className="pointer-events-auto px-4 py-2 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl flex items-center gap-2">
          <span className="text-gray-400 text-xs font-semibold">Zoom:</span>
          <span className="text-white font-bold">{viewState.zoom.toFixed(1)}</span>
        </div>
        <button
          onClick={handleZoomIn}
          className="pointer-events-auto w-12 h-12 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl hover:from-black/90 hover:to-black/70 transition-all flex items-center justify-center text-white text-xl font-bold hover:scale-110"
          title="Zoom In"
        >
          +
        </button>
      </div>

      {/* Stats Cards - Below Explore Locations */}

      {/* River Water Quality Modal */}
      {selectedRiver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedRiver(null)} />
          <div className="relative bg-gradient-to-br from-cyan-900 to-blue-900 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto pointer-events-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">💧 Water Quality Analysis</h2>
                <p className="text-cyan-300 text-lg font-bold">{selectedRiver.name}</p>
              </div>
              <button
                onClick={() => setSelectedRiver(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status Alert */}
            <div className={`border-2 rounded-xl p-4 mb-4 ${
              selectedRiver.status === 'Critical' ? 'bg-red-500/20 border-red-500' :
              selectedRiver.status === 'Severe' ? 'bg-orange-500/20 border-orange-500' :
              'bg-yellow-500/20 border-yellow-500'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">🚨</div>
                <div>
                  <p className="text-white text-lg font-bold">{selectedRiver.status} Pollution</p>
                  <p className="text-gray-300 text-sm">Treatment Priority: {selectedRiver.treatmentNeeded}</p>
                </div>
              </div>
            </div>

            {/* Pollution Metrics */}
            <div className="bg-black/40 rounded-xl p-4 mb-4">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                📊 Pollution Indicators
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">BOD (Biochemical Oxygen Demand)</span>
                    <span className="text-red-400 font-bold">{selectedRiver.pollutionLevel} mg/L</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                      style={{ width: `${Math.min((selectedRiver.pollutionLevel / 200) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Standard limit: 10 mg/L | Current: {selectedRiver.pollutionLevel / 10}x over limit</p>
                </div>
              </div>
            </div>

            {/* Main Pollutants */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-xl p-4 mb-4">
              <h3 className="text-white font-bold text-sm mb-3">🏭 Main Pollutants</h3>
              <div className="space-y-2">
                {selectedRiver.mainPollutants.map((pollutant, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-red-400">•</span>
                    <p className="text-gray-200">{pollutant}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setSelectedRiver(null)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}

      {/* High-Exposure Zone Modal */}
      {selectedZone && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedZone(null)} />
          <div className="relative bg-gradient-to-br from-red-900 to-orange-900 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto pointer-events-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">⚠️ High-Exposure Community</h2>
                <p className="text-red-300 text-lg font-bold">{selectedZone.name}</p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Urgency Alert */}
            <div className="bg-red-500/30 border-2 border-red-500 rounded-xl p-4 mb-4 animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">🚨</div>
                <div>
                  <p className="text-white text-lg font-bold">URGENCY: {selectedZone.urgency}</p>
                  <p className="text-gray-200 text-sm">Immediate action required for {selectedZone.population.toLocaleString()} people</p>
                </div>
              </div>
            </div>

            {/* Dual Pollution Threat */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-3">
                <p className="text-orange-300 text-xs mb-1 font-semibold">🌫️ AIR POLLUTION (NO₂)</p>
                <p className="text-white text-2xl font-bold">{selectedZone.airPollution} μg/m³</p>
                <p className="text-gray-300 text-xs mt-1">{(selectedZone.airPollution / 40).toFixed(1)}x WHO limit</p>
              </div>
              <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-3">
                <p className="text-cyan-300 text-xs mb-1 font-semibold">💧 WATER POLLUTION (BOD)</p>
                <p className="text-white text-2xl font-bold">{selectedZone.waterPollution} mg/L</p>
                <p className="text-gray-300 text-xs mt-1">{(selectedZone.waterPollution / 10).toFixed(1)}x standard limit</p>
              </div>
            </div>

            {/* Vulnerable Groups */}
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 mb-4">
              <h3 className="text-yellow-300 font-bold text-sm mb-3">👥 Vulnerable Groups</h3>
              <div className="space-y-2">
                {selectedZone.vulnerableGroups.map((group, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-400">•</span>
                    <p className="text-gray-200">{group}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-yellow-500/30">
                <p className="text-white text-sm font-bold">Health Impact:</p>
                <p className="text-gray-200 text-sm">{selectedZone.healthImpact}</p>
              </div>
            </div>

            {/* Interventions */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-4 mb-4">
              <h3 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2">
                💡 Required Interventions (Air + Water)
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {selectedZone.interventions.map((intervention, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">•</span>
                    <p className="text-gray-200">{intervention}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedZone(null)}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}

      {/* Pollution Data Detail Modal */}
      {selectedPollutionPoint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedPollutionPoint(null)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/50 rounded-2xl p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto pointer-events-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">🔬 Pollution Data Analysis</h2>
                <p className="text-gray-400 text-sm">Click details • Real-time monitoring</p>
              </div>
              <button
                onClick={() => setSelectedPollutionPoint(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Source Info */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">🏭</div>
                <div>
                  <p className="text-yellow-400 text-lg font-bold">{selectedPollutionPoint.source}</p>
                  <p className="text-gray-400 text-xs">Emission Source</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Coordinates</p>
                  <p className="text-white text-sm font-mono">
                    {selectedPollutionPoint.position[1].toFixed(4)}°N<br/>
                    {selectedPollutionPoint.position[0].toFixed(4)}°E
                  </p>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Timestamp</p>
                  <p className="text-white text-sm font-mono">
                    {new Date(selectedPollutionPoint.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Pollutant Levels */}
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 rounded-xl p-4 mb-4">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                📊 Pollutant Concentrations
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">NO₂ (Nitrogen Dioxide)</span>
                    <span className="text-red-400 font-bold">{Math.round(selectedPollutionPoint.concentration)} μg/m³</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                      style={{ width: `${Math.min((selectedPollutionPoint.concentration / 200) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">PM2.5 (Particulate Matter)</span>
                    <span className="text-orange-400 font-bold">{selectedPollutionPoint.particulateMatter} μg/m³</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                      style={{ width: `${Math.min((selectedPollutionPoint.particulateMatter / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">CO (Carbon Monoxide)</span>
                    <span className="text-yellow-400 font-bold">{selectedPollutionPoint.coLevel} ppm</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                      style={{ width: `${Math.min((selectedPollutionPoint.coLevel / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3">
                <p className="text-blue-400 text-xs mb-1">💨 Wind Speed</p>
                <p className="text-white text-lg font-bold">{selectedPollutionPoint.windSpeed} m/s</p>
              </div>
              <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-3">
                <p className="text-cyan-400 text-xs mb-1">💧 Humidity</p>
                <p className="text-white text-lg font-bold">{selectedPollutionPoint.humidity}%</p>
              </div>
              <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-3">
                <p className="text-orange-400 text-xs mb-1">🌡️ Temperature</p>
                <p className="text-white text-lg font-bold">{selectedPollutionPoint.temperature}°C</p>
              </div>
            </div>

            {/* Mitigation Strategies */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-4">
              <h3 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2">
                💡 Recommended Mitigation Strategies
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {getMitigationStrategy(
                  selectedPollutionPoint.concentration,
                  selectedPollutionPoint.source,
                  'High'
                ).map((strategy, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">•</span>
                    <p className="text-gray-200">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedPollutionPoint(null)}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}

      {/* Camera Info - Bottom Right */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-2xl border border-white/20 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-gray-400 text-xs font-mono">
            🎥 Pitch: {Math.round(viewState.pitch)}° • Bearing: {Math.round(viewState.bearing)}° • Zoom: {viewState.zoom.toFixed(1)}
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </div>
  );
}
