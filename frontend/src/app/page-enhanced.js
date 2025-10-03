"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Globe, 
  MapPin, 
  TrendingUp, 
  Users,
  Satellite,
  Brain,
  TreePine,
  Droplets,
  Wind,
  Zap,
  Shield,
  Target,
  Sparkles,
  LineChart
} from "lucide-react";

export default function EnhancedHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <Globe className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                OASIS
              </h1>
              <p className="text-xs text-emerald-300/70">Climate Intelligence Platform</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Community
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg shadow-emerald-500/30">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-1">
              <Satellite className="h-3 w-3 mr-2" />
              NASA Space Apps Challenge 2025
            </Badge>
            
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Urban Climate
              </span>
              <br />
              <span className="text-white">Intelligence</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              The <span className="text-emerald-400 font-semibold">central nervous system</span> for climate-resilient cities. 
              Forging a <span className="text-blue-400 font-semibold">&ldquo;Digital Covalent Bond&rdquo;</span> between 
              top-down satellite data and bottom-up community wisdom.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <Satellite className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">NASA Earth Data</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <Brain className="h-5 w-5 text-blue-400" />
                <span className="text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="text-sm">Community-Driven</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-xl shadow-emerald-500/30 text-lg px-8">
                  Launch Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline" className="border-2 border-white/20 hover:bg-white/10 text-white text-lg px-8">
                  Explore Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20"></div>
              <img 
                src="/api/placeholder/800/600" 
                alt="Climate Dashboard Preview"
                className="w-full opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              
              {/* Floating Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Temperature</p>
                    <p className="text-xl font-bold text-white">32.5°C</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Air Quality</p>
                    <p className="text-xl font-bold text-white">Good</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Sparkles className="h-3 w-3 mr-2" />
            Advanced Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive climate intelligence tools powered by NASA Earth observations and AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full group hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-300">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="relative z-10 text-center py-20 px-6">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Build Climate-Resilient Cities?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join urban planners, city leaders, and community advocates using OASIS to create 
              sustainable, equitable environments through AI-powered collaboration.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl text-lg px-8">
                  Start Planning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white/40 hover:bg-white/10 text-white text-lg px-8">
                View Documentation
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-white/10">
        <div className="text-center text-slate-400">
          <p className="mb-2">Built for NASA Space Apps Challenge 2025</p>
          <p className="text-sm">© 2025 OASIS Platform. Powered by NASA Earth Observations.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Satellite,
    title: "NASA Earth Data",
    description: "Real-time satellite imagery and climate data from MODIS, Landsat, and Sentinel missions",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    icon: Brain,
    title: "AI Chief of Staff",
    description: "Natural language queries and AI-powered recommendations for climate interventions",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: LineChart,
    title: "Impact Simulation",
    description: "Predict cascading effects of interventions with multi-year climate models",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: TreePine,
    title: "Heat Island Analysis",
    description: "Identify urban heat hotspots and recommend green infrastructure solutions",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    icon: Droplets,
    title: "Flood Risk Assessment",
    description: "DEM-based flood vulnerability mapping with real-time precipitation data",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    icon: Wind,
    title: "Air Quality Monitoring",
    description: "Track PM2.5, NO2, and pollutants using Sentinel-5P TROPOMI data",
    gradient: "from-slate-500 to-gray-600"
  },
  {
    icon: Users,
    title: "Civic Garden",
    description: "Gamified community engagement with seed economy and ground-truthing",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Target,
    title: "ROI Optimization",
    description: "Multi-factor cost-benefit analysis for climate interventions",
    gradient: "from-amber-500 to-yellow-600"
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Live climate monitoring with automated alerts and notifications",
    gradient: "from-violet-500 to-purple-600"
  }
];
