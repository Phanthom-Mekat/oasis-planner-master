"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";                  <div className={`rounded-xl p-3.5 shadow-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-800 dark:to-slate-800 border-2 border-purple-100 dark:border-slate-700'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 font-medium ${ Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  MapPin,
  DollarSign,
  Users,
  Zap,
  Download
} from "lucide-react";

export function AIChiefOfStaff() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Good morning! I've analyzed latest NASA satellite data for Dhaka and identified 3 critical areas requiring immediate attention.",
      timestamp: "9:15 AM",
      suggestions: [
        { text: "Dhaka flood risk zones (NASA MODIS)", type: "analysis", icon: TrendingUp },
        { text: "Critical AQI areas (50+ locations)", type: "alert", icon: AlertTriangle },
        { text: "Heat island mitigation budget", type: "financial", icon: DollarSign }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeInsight, setActiveInsight] = useState(null);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    {
      text: "What are the top 3 cost-effective heat reduction projects for Dhaka?",
      icon: TrendingUp,
      category: "Financial"
    },
    {
      text: "Show me Dhaka areas with worst flood risk and air quality",
      icon: AlertTriangle, 
      category: "Equity"
    },
    {
      text: "Which NASA datasets are most relevant for Dhaka climate analysis?",
      icon: Users,
      category: "NASA Data"
    },
    {
      text: "Generate flood mitigation proposal for critical zones",
      icon: DollarSign,
      category: "Planning"
    }
  ];

  const simulateAIResponse = (userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = "";
      let suggestions = [];
      const msg = userMessage.toLowerCase();

      // Heat reduction / temperature related queries
      if ((msg.includes("cost") || msg.includes("budget")) && (msg.includes("heat") || msg.includes("temperature") || msg.includes("cool"))) {
        response = "🌡️ **Cost-Effective Heat Reduction Analysis for Dhaka**\n\n**Top 3 Priority Projects (NASA MODIS/LANDSAT Validated):**\n\n**1️⃣ Cool Pavement - Motijheel to Gulshan**\n• Cost Efficiency: **$0.80/resident/year**\n• Investment: $485,000 (18.5km corridor)\n• Impact: -2.1°C surface temperature reduction\n• Population: 605,000 residents\n• Timeline: 14 months\n• ROI: 3.5 years\n🛰️ MODIS LST shows 33.5°C peak (5°C above baseline)\n\n**2️⃣ Green Rooftops - Gulshan-Banani**\n• Cost Efficiency: **$1.32/resident/year**\n• Investment: $680,000 (2,800 buildings)\n• Impact: -3.2°C building temperature, 28% energy savings\n• Population: 515,000 residents\n• Timeline: 18 months\n🛰️ LANDSAT thermal: 34°C rooftop temperatures\n\n**3️⃣ Urban Forest Belt - Mirpur-Uttara**\n• Cost Efficiency: **$0.66/resident/year**\n• Investment: $825,000 (15,500 trees)\n• Impact: -2.8°C ambient, 1,850 tons CO2/year\n• Population: 1.25M residents\n• Timeline: 24 months\n🛰️ NDVI analysis: 15% vegetation deficit vs optimal\n\n💰 **Total Investment**: $1.99M for 2.37M residents\n📊 **Avg Temperature Reduction**: 2.7°C\n⚡ **Energy Savings**: $2.8M/year\n🎯 **Payback Period**: 2.1 years";
        suggestions = [
          { text: "Generate detailed implementation roadmap", type: "action", icon: Zap },
          { text: "Show MODIS thermal comparison (before/after)", type: "analysis", icon: TrendingUp },
          { text: "Calculate 10-year financial projections", type: "financial", icon: DollarSign }
        ];
      } 
      // Flood risk queries
      else if (msg.includes("flood") && (msg.includes("risk") || msg.includes("area") || msg.includes("zone") || msg.includes("critical"))) {
        response = "🌊 **Dhaka Flood Risk Assessment (NASA GPM/MODIS Data)**\n\n**CRITICAL RISK ZONES (Immediate Action Required):**\n\n**🔴 Jatrabari-Demra Corridor**\n• Rainfall: 72-73mm (monsoon peak)\n• Flood Frequency: 8-10 events/year\n• Population at Risk: 485,000\n• Avg Flood Depth: 1.2-1.8m\n• Economic Impact: $12M/year\n• Infrastructure: 35% roads flood-prone\n🛰️ GPM precipitation + SRTM elevation shows 2m depression\n**Recommended**: $1.25M drainage upgrade + early warning system\n\n**🔴 Keraniganj South**\n• Rainfall: 69mm sustained\n• Flood Frequency: 12+ events/year\n• Population at Risk: 625,000\n• River Proximity: 500m from Buriganga\n• Soil Saturation: 91% (critical)\n🛰️ MODIS shows 85% impervious surface (poor drainage)\n**Recommended**: Green infrastructure + retention ponds\n\n**🟠 Hazaribagh Industrial**\n• Rainfall: 75mm (highest in Dhaka)\n• Combined Risk: Flood + AQI 195 (toxic runoff)\n• Population: 420,000\n• Industrial Runoff: High contamination\n🛰️ VIIRS shows dense built-up + no green buffer\n**Recommended**: Industrial wastewater management first\n\n**📊 SUMMARY:**\n• Total at Risk: **1.53M residents**\n• Annual Economic Loss: **$28.5M**\n• Infrastructure Damage: **$15M/year**\n• Required Investment: **$3.2M** (mitigation)\n• Expected Reduction: **65% fewer flood events**";
        suggestions = [
          { text: "Design emergency evacuation routes", type: "action", icon: Zap },
          { text: "Access real-time GPM rainfall data", type: "alert", icon: AlertTriangle },
          { text: "Calculate flood insurance premiums", type: "financial", icon: DollarSign }
        ];
      }
      // Air quality queries
      else if (msg.includes("air quality") || msg.includes("aqi") || msg.includes("pollution")) {
        response = "💨 **Dhaka Air Quality Crisis Analysis (NASA MERRA-2/OMI)**\n\n**CRITICAL AQI ZONES (>180 Unhealthy):**\n\n**🔴 Hazaribagh Industrial**\n• Current AQI: **195** (Very Unhealthy)\n• PM2.5: 89 µg/m³ (WHO limit: 15)\n• NO2: 42 ppb (industrial emissions)\n• Population Affected: 420,000\n• Health Impact: 3,200 respiratory cases/year\n🛰️ OMI shows persistent NO2 plume from tanneries\n**Action**: Immediate industrial filter installation ($580K)\n\n**🔴 Tejgaon Industrial**\n• Current AQI: **185** (Unhealthy)\n• PM2.5: 78 µg/m³\n• Ozone: 68 ppb\n• Population: 490,000\n• Traffic Contribution: 45%\n🛰️ MERRA-2 aerosol depth: 0.85 (3x rural areas)\n**Action**: Green corridors + traffic management\n\n**🔴 Narayanganj East**\n• Current AQI: **185** (Unhealthy)\n• PM2.5: 82 µg/m³\n• Industrial: Textile/garment emissions\n• Population: 950,000\n🛰️ VIIRS shows 24/7 industrial activity\n**Action**: Emission standards enforcement\n\n**🟠 Demra**\n• Current AQI: **182**\n• Combined: Poor air + flood risk\n• Population: 380,000\n\n**📊 DHAKA AQI STATISTICS:**\n• Avg City AQI: **156** (Unhealthy for Sensitive)\n• Days >100 AQI: 287/365 (79%)\n• Population Exposed: **12.5M**\n• Annual Health Cost: **$2.8B**\n• Premature Deaths: 15,000/year\n\n💡 **Priority Investment**: $1.5M for industrial filters in top 3 zones would improve AQI by 35 points for 1.86M residents";
        suggestions = [
          { text: "Generate air quality improvement plan", type: "action", icon: Zap },
          { text: "View OMI NO2 pollution heatmap", type: "analysis", icon: TrendingUp },
          { text: "Calculate health cost savings", type: "financial", icon: DollarSign }
        ];
      }
      // NASA dataset queries
      else if (msg.includes("nasa") || msg.includes("dataset") || msg.includes("satellite") || msg.includes("data")) {
        response = "🛰️ **NASA Earth Observation Datasets for Dhaka**\n\n**THERMAL & VEGETATION:**\n\n**1. MODIS (Terra/Aqua)** ⭐ Most Used\n• Resolution: 250m-1km\n• Frequency: Daily (2x/day)\n• Data: Land Surface Temperature, NDVI, EVI\n• Coverage: 2000-present (25 years)\n• Use Case: Heat island mapping, vegetation health\n📊 **Current**: 50+ Dhaka locations monitored\n🔥 **Finding**: 4-6°C heat differential across city\n\n**2. LANDSAT 8/9**\n• Resolution: 30m (high detail)\n• Frequency: 16-day revisit\n• Data: Thermal infrared (TIR), multispectral\n• Use Case: Detailed urban heat analysis, land use\n📊 **Current**: 15,500 building rooftops analyzed\n🏢 **Finding**: Commercial zones 5°C hotter than residential\n\n**RAINFALL & FLOOD:**\n\n**3. GPM (Global Precipitation)**\n• Resolution: 10km\n• Frequency: 30-minute updates\n• Data: Rainfall rate, accumulation\n• Use Case: Flood forecasting, monsoon tracking\n📊 **Critical**: 72mm/day threshold = flood risk\n🌧️ **Finding**: 8-12 flood events/year in Jatrabari\n\n**URBAN GROWTH:**\n\n**4. VIIRS (Day/Night Band)**\n• Resolution: 750m\n• Data: Nighttime lights, urban expansion\n• Use Case: Economic activity, growth patterns\n📊 **Growth Rate**: 4.2-9.2x in outer Dhaka (2010-2025)\n\n**5. GHSL (Built-up Areas)**\n• Historical: 1975-2025\n• Data: Urban settlement evolution\n📊 **Finding**: 380% expansion in 50 years\n\n**POPULATION:**\n\n**6. WorldPop**\n• Resolution: 100m\n• Data: Population density distribution\n📊 **Dhaka Metro**: 20.2M residents\n👥 **Density**: 85K-1.25M per neighborhood\n\n**AIR QUALITY:**\n\n**7. MERRA-2**\n• Data: PM2.5, aerosol optical depth\n• Use Case: Pollution tracking\n📊 **Current**: AQI 135-195 across zones\n\n**8. OMI (Aura)**\n• Data: NO2, SO2, ozone\n• Use Case: Industrial emission tracking\n📊 **Hotspot**: Hazaribagh (42 ppb NO2)\n\n**🎯 RECOMMENDATION FOR YOUR PROJECT:**\nPrimary: **MODIS + LANDSAT** (temperature analysis)\nSecondary: **GPM + VIIRS** (flood + growth)\nValidation: **MERRA-2 + OMI** (air quality)\n\n💾 **Data Access**: All datasets available via NASA Earthdata";
        suggestions = [
          { text: "Set up automated MODIS data pipeline", type: "action", icon: Zap },
          { text: "Generate multi-dataset correlation report", type: "analysis", icon: TrendingUp },
          { text: "Schedule weekly NASA data briefings", type: "planning", icon: Users }
        ];
      }
      // Project or mitigation proposal queries
      else if (msg.includes("proposal") || msg.includes("plan") || msg.includes("project") || msg.includes("mitigation")) {
        response = "📋 **Climate Mitigation Proposal Generator**\n\nBased on your current 5 active projects, here's an integrated mitigation strategy:\n\n**PHASE 1: Immediate (0-6 months) - $1.25M**\n\n🌊 **Flood Mitigation - Jatrabari-Demra**\n• Status: 62% complete\n• Action: Accelerate drainage system phase 2\n• Investment: $780K additional\n• Impact: Protect 485K residents\n• NASA Validation: GPM real-time monitoring\n\n**PHASE 2: Short-term (6-18 months) - $1.74M**\n\n🌡️ **Heat Reduction Package:**\n• Urban Forest (Mirpur-Uttara): $380K remaining\n• Cool Pavement (Motijheel-Gulshan): $350K (new phase)\n• Green Rooftops (Gulshan-Banani): $218K remaining\n• Combined Impact: -2.7°C for 2.37M residents\n\n💨 **Air Quality Initiative:**\n• Tejgaon Industrial Filters: $244K remaining\n• Impact: AQI 185→150 for 490K residents\n\n**PHASE 3: Long-term (18-36 months) - $0.82M**\n\n📊 **Monitoring & Expansion:**\n• NASA data integration system\n• Community early warning network\n• Climate dashboard expansion\n\n**💰 TOTAL INVESTMENT REQUIRED:**\n• Immediate: $1.25M\n• Short-term: $1.74M\n• Long-term: $0.82M\n• **TOTAL**: $3.81M over 36 months\n\n**📈 EXPECTED OUTCOMES:**\n• **Population Served**: 3.84M residents\n• **Temperature Reduction**: 2.7°C average\n• **Flood Risk Reduction**: 65%\n• **AQI Improvement**: 35 points\n• **Economic Benefit**: $8.5M/year\n• **ROI**: 2.2 years\n• **NASA Confidence**: 88%\n\n**🎯 RECOMMENDED PRIORITY:**\n1. Complete Jatrabari flood system (CRITICAL)\n2. Accelerate Tejgaon air quality (HIGH)\n3. Launch cool pavement pilot (MEDIUM)\n\n**📅 NEXT STEPS:**\n• Secure Phase 1 funding ($1.25M)\n• Finalize MODIS/GPM data feeds\n• Establish community partnerships\n• Begin Phase 1 in 30 days";
        suggestions = [
          { text: "Generate detailed project timeline (Gantt)", type: "planning", icon: Users },
          { text: "Draft funding proposal for Phase 1", type: "financial", icon: DollarSign },
          { text: "Simulate 5-year climate impact", type: "simulation", icon: MapPin }
        ];
      }
      // Budget or financial queries
      else if (msg.includes("budget") || msg.includes("cost") || msg.includes("money") || msg.includes("investment")) {
        response = "💰 **Dhaka Climate Budget Analysis**\n\n**CURRENT PROJECT PORTFOLIO:**\n\n**Active Projects (5):**\n• Total Budget: **$3.82M**\n• Allocated: **$2.45M** (64%)\n• Remaining: **$1.37M** (36%)\n• Avg Progress: **58%**\n\n**PROJECT BREAKDOWN:**\n\n1️⃣ **Flood Mitigation** (Jatrabari-Demra)\n• Budget: $1,250,000 (33% of total)\n• Spent: $775,000 (62%)\n• Remaining: $475,000\n• Status: ON TRACK ✅\n• Cost per resident: $2.58\n\n2️⃣ **Urban Forest** (Mirpur-Uttara)\n• Budget: $825,000 (22%)\n• Spent: $643,500 (78%)\n• Remaining: $181,500\n• Status: AHEAD OF SCHEDULE ✅\n• Cost per resident: $0.66/year\n\n3️⃣ **Green Rooftops** (Gulshan-Banani)\n• Budget: $680,000 (18%)\n• Spent: $462,400 (68%)\n• Remaining: $217,600\n• Status: ON TRACK ✅\n• Cost per resident: $1.32/year\n\n4️⃣ **Air Quality** (Tejgaon)\n• Budget: $580,000 (15%)\n• Spent: $319,000 (55%)\n• Remaining: $261,000\n• Status: NEEDS ACCELERATION ⚠️\n• Cost per resident: $1.18\n\n5️⃣ **Cool Pavement** (Motijheel-Gulshan)\n• Budget: $485,000 (13%)\n• Spent: $135,800 (28%)\n• Remaining: $349,200\n• Status: PLANNING PHASE 📋\n• Cost per resident: $0.80/year\n\n**💡 COST EFFICIENCY RANKING:**\n1. **Urban Forest**: $0.66/resident/year (BEST)\n2. **Cool Pavement**: $0.80/resident/year\n3. **Air Quality**: $1.18/resident\n4. **Green Rooftops**: $1.32/resident/year\n5. **Flood Mitigation**: $2.58/resident (one-time)\n\n**📊 FINANCIAL HEALTH:**\n• Budget Utilization: **64%** (healthy)\n• Cost Overruns: **None** (0%)\n• Savings to Date: **$180K** (better efficiency)\n• Projected ROI: **2.2 years**\n\n**🎯 RECOMMENDATIONS:**\n• Reallocate $180K savings to Tejgaon (accelerate)\n• Secure additional $1.2M for expansion\n• Target $1.50/resident average efficiency";
        suggestions = [
          { text: "Generate quarterly financial report", type: "report", icon: Download },
          { text: "Optimize budget allocation across projects", type: "financial", icon: DollarSign },
          { text: "Calculate break-even analysis", type: "analysis", icon: TrendingUp }
        ];
      }
      // General or unclear queries
      else {
        response = "🤖 **AI Chief of Staff - Dhaka Climate Intelligence**\n\nI'm your intelligent climate strategy assistant with access to:\n\n**🛰️ NASA Earth Observation Data:**\n• 8 active satellite datasets (MODIS, LANDSAT, VIIRS, GPM, GHSL, WorldPop, MERRA-2, OMI)\n• 50+ Dhaka locations monitored in real-time\n• 25 years of historical climate data (2000-2025)\n• Daily updates with 88% confidence validation\n\n**📊 Current Project Portfolio:**\n• 5 active climate mitigation projects\n• $3.82M total investment\n• 3.84M residents served\n• 58% average progress\n• 2.2-year projected ROI\n\n**🎯 I can help you with:**\n\n**Climate Analysis:**\n• Heat island identification & mitigation\n• Flood risk assessment & forecasting\n• Air quality monitoring & improvement\n• Vegetation analysis & urban greening\n\n**Financial Planning:**\n• Budget optimization & allocation\n• Cost-benefit analysis\n• ROI projections\n• Funding proposals\n\n**Project Management:**\n• Progress tracking (5 active projects)\n• Risk assessment\n• Timeline optimization\n• Resource allocation\n\n**NASA Data Integration:**\n• Real-time satellite data feeds\n• Historical trend analysis\n• Multi-dataset correlation\n• Validation & confidence scoring\n\n**💬 Try asking me:**\n• \"What's the most cost-effective heat reduction strategy?\"\n• \"Show me critical flood risk zones in Dhaka\"\n• \"Which areas have the worst air quality?\"\n• \"Generate a mitigation proposal for high-risk zones\"\n• \"Analyze budget allocation across all projects\"\n• \"What NASA datasets are available for Dhaka?\"\n\n**🔍 What would you like to explore?**";
        suggestions = [
          { text: "Show today's NASA climate alerts", type: "alert", icon: AlertTriangle },
          { text: "Analyze all 50+ Dhaka neighborhoods", type: "analysis", icon: TrendingUp },
          { text: "Generate comprehensive climate report", type: "report", icon: Download }
        ];
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "ai", 
        content: response,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        suggestions
      }]);
      setIsTyping(false);
    }, 1800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    simulateAIResponse(inputValue);
    setInputValue("");

    toast({
      title: "Message sent",
      description: "Your message has been sent to the AI Chief of Staff.",
      variant: "success"
    });
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
    handleSendMessage();
  };

  const handleSuggestion = (suggestion) => {
    setInputValue(suggestion.text);
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-2 border-purple-200 dark:border-purple-900 shadow-lg">
      <CardHeader className="border-b-2 border-purple-200 dark:border-slate-700 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900 dark:text-slate-100 text-lg font-bold">AI Chief of Staff</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                🛰️ NASA-Powered Climate Intelligence
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 font-semibold shadow-sm">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        {/* Quick Insights Panel */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800 rounded-xl p-4 border-2 border-purple-100 dark:border-slate-700 shadow-md">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span>Priority Insights</span>
            <Badge variant="outline" className="ml-auto text-xs bg-purple-50 border-purple-200 text-purple-700">Quick Access</Badge>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {quickPrompts.slice(0, 3).map((prompt, index) => (
              <EnhancedButton
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-2 text-left hover:bg-blue-50 dark:hover:bg-slate-700"
                onClick={() => {
                  setActiveInsight(prompt);
                  handleQuickPrompt(prompt.text);
                }}
                animateOnClick={true}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                    <prompt.icon className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-0.5">
                      {prompt.category}
                    </div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {prompt.text}
                    </div>
                  </div>
                </div>
              </EnhancedButton>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800 rounded-xl border-2 border-purple-100 dark:border-slate-700 shadow-md">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}>
                  <Avatar className={`h-9 w-9 ring-2 ring-offset-2 ${
                    message.type === 'user' ? 'ring-blue-300' : 'ring-purple-300'
                  }`}>
                    <AvatarFallback className={
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold' 
                        : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                    }>
                      {message.type === 'user' ? 'YOU' : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`rounded-xl p-3.5 shadow-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-800 dark:to-slate-800 border-2 border-purple-100 dark:border-slate-700'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 font-medium ${
                      message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {message.timestamp}
                    </div>
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="mr-2 mb-2"
                            onClick={() => handleSuggestion(suggestion)}
                          >
                            {suggestion.type === 'action' && <Zap className="h-3 w-3 mr-1" />}
                            {suggestion.type === 'analysis' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {suggestion.type === 'alert' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {suggestion.type === 'simulation' && <MapPin className="h-3 w-3 mr-1" />}
                            {suggestion.type === 'planning' && <Users className="h-3 w-3 mr-1" />}
                            {suggestion.type === 'report' && <Download className="h-3 w-3 mr-1" />}
                            {suggestion.type === 'financial' && <DollarSign className="h-3 w-3 mr-1" />}
                            <span className="text-xs">{suggestion.text}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="border-t-2 border-purple-100 dark:border-slate-700 p-3 bg-gradient-to-r from-purple-50/30 to-blue-50/30 dark:from-slate-800 dark:to-slate-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Dhaka climate, NASA data, projects, or budget..."
                className="flex-1 px-4 py-2.5 border-2 border-purple-200 dark:border-slate-600 rounded-xl text-sm font-medium
                           focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:bg-slate-700 dark:text-slate-100
                           placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <EnhancedButton 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                loading={isTyping}
                loadingText="Analyzing..."
                size="sm"
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-700 shadow-lg px-4"
              >
                <Send className="h-4 w-4" />
              </EnhancedButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
