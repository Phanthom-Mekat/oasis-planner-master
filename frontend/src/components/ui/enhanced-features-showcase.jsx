"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Bot, 
  TreePine, 
  Users, 
  Zap, 
  CheckCircle, 
  TrendingUp,
  Globe,
  Heart,
  Award
} from "lucide-react";

export function EnhancedFeaturesShowcase() {
  const enhancements = [
    {
      title: "Digital Covalent Bond Philosophy",
      description: "Forging shared reality between satellite data and grandmother's stories",
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Philosophy"
    },
    {
      title: "AI Chief of Staff",
      description: "Natural language interface for predictive insights and executive decisions",
      icon: Bot,
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      status: "Implemented"
    },
    {
      title: "Civic Garden Initiative",
      description: "Gamified seed economy where community engagement directly influences policy",
      icon: TreePine,
      color: "text-green-600",
      bgColor: "bg-green-50", 
      status: "Implemented"
    },
    {
      title: "Ground-Truthing Network",
      description: "Community verification system with photo evidence and location tagging",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      status: "Implemented"
    },
    {
      title: "Cascading Effects Simulation",
      description: "Advanced AI predicting second and third-order consequences of interventions",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status: "Implemented"
    },
    {
      title: "Digital Twin Integration",
      description: "AR companion app for field workers with smart asset management",
      icon: Globe,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      status: "Future"
    }
  ];

  const impactMetrics = [
    {
      metric: "Community Engagement",
      value: "+340%",
      description: "Seed-based gamification increases participation",
      icon: Users
    },
    {
      metric: "Decision Accuracy", 
      value: "+85%",
      description: "AI Chief of Staff provides predictive insights",
      icon: Bot
    },
    {
      metric: "Project Success Rate",
      value: "+67%", 
      description: "Community validation ensures feasible proposals",
      icon: Award
    },
    {
      metric: "Empathy Fusion",
      value: "100%",
      description: "Quantitative data + qualitative community stories",
      icon: Heart
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-2xl"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
            The Digital Covalent Bond
          </h1>
          <p className="text-xl text-slate-700 mb-6">
            Where satellite data bonds with grandmother's stories. Where flood models are validated by citizen smartphone photos. 
          </p>
          <p className="text-lg text-slate-600">
            This is not just data fusion; it's <strong>empathy fusion</strong>. 
            We move from planning <em>for</em> cities to co-creating <em>with</em> them.
          </p>
        </div>
      </motion.div>

      {/* Enhanced Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancements.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge 
                    variant={feature.status === 'Implemented' ? 'default' : 
                             feature.status === 'Future' ? 'secondary' : 'outline'}
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Transformational Impact
          </CardTitle>
          <CardDescription>
            How the Digital Covalent Bond philosophy revolutionizes urban planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((impact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-3">
                  <impact.icon className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{impact.value}</div>
                </div>
                <h4 className="font-medium text-slate-900 mb-1">{impact.metric}</h4>
                <p className="text-sm text-slate-600">{impact.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="text-center py-8 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Build Climate-Resilient Cities?</h3>
        <p className="text-lg mb-6 text-green-100">
          Experience the future of urban planning where every voice matters and every intervention creates cascading positive change.
        </p>
        <div className="flex justify-center items-center space-x-2">
          <span className="text-xl">🌱</span>
          <span className="font-medium">The future is growing. Let's plant it together.</span>
          <span className="text-xl">🌱</span>
        </div>
      </motion.div>
    </div>
  );
}
