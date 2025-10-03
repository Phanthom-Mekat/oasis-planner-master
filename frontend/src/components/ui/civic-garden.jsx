"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Sprout, 
  Heart, 
  Star, 
  Users, 
  Award,
  Coins,
  MessageCircle,
  ThumbsUp,
  Share2,
  TreePine,
  Droplets,
  Building2,
  Camera,
  CheckCircle,
  Plus,
  Trophy,
  Minus
} from "lucide-react";

export function CivicGarden({ project }) {
  const [userSeeds, setUserSeeds] = useState(847);
  const [seedsPlanted, setSeedsPlanted] = useState(0);
  const { toast } = useToast();

  // Community proposals with seed economy
  const communityProposals = [
    {
      id: 1,
      title: "Miyawaki Forest for East Side",
      author: "Anika Patel",
      description: "Dense native tree forest using Japanese Miyawaki method for rapid cooling",
      location: "East Side Neighborhood",
      seedsRequired: 500,
      seedsRaised: 387,
      supporters: 42,
      daysLeft: 18,
      impact: "-3.2°C cooling",
      category: "Urban Forest",
      status: "Fundraising"
    },
    {
      id: 2,
      title: "Cool Roof Program - Schools",
      author: "Dr. Sarah Chen",
      description: "Reflective coating on 12 school rooftops to reduce indoor temperatures",
      location: "School District 3",
      seedsRequired: 300,
      seedsRaised: 290,
      supporters: 67,
      daysLeft: 3,
      impact: "-2.1°C cooling",
      category: "Cool Infrastructure",
      status: "Almost Funded"
    }
  ];

  // Ways to earn seeds
  const seedEarningActions = [
    { action: "Submit Climate Proposal", seeds: 50, icon: Sprout, description: "Share your climate solution idea" },
    { action: "Support a Proposal", seeds: 10, icon: Heart, description: "Vote and contribute to community projects" },
    { action: "Validate Field Data", seeds: 25, icon: Star, description: "Help verify community-collected climate data" },
    { action: "Share Success Story", seeds: 30, icon: Share2, description: "Document and share project outcomes" },
    { action: "Attend Community Meeting", seeds: 20, icon: Users, description: "Participate in local climate planning" },
    { action: "Complete Project Milestone", seeds: 100, icon: Award, description: "Successfully implement project phase" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Fundraising": return "bg-blue-100 text-blue-800";
      case "Almost Funded": return "bg-green-100 text-green-800";
      case "Implementing": return "bg-orange-100 text-orange-800";
      case "Complete": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const supportProposal = (proposalId, seedAmount) => {
    if (userSeeds >= seedAmount) {
      setUserSeeds(prev => prev - seedAmount);
      setSeedsPlanted(prev => prev + seedAmount);
      toast({
        title: "Seeds Planted!",
        description: `You've planted ${seedAmount} seeds to support the proposal.`,
        duration: 3000
      });
    } else {
      toast({
        title: "Insufficient Seeds",
        description: "You don't have enough seeds for this action.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const earnSeeds = (action) => {
    setUserSeeds(prev => prev + action.seeds);
    toast({
      title: "Seeds Earned!",
      description: `You earned ${action.seeds} seeds for: ${action.action}`,
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      {/* Civic Garden Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sprout className="h-8 w-8 text-green-600" />
                Civic Garden
              </CardTitle>
              <CardDescription className="text-lg">
                Grow climate solutions together through our gamified community platform
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{userSeeds}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Seeds Available</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Projects Supported</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Data Validated</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">High</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Community Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Community Proposals</CardTitle>
          <CardDescription>
            Support climate projects with your seeds and watch them grow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communityProposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{proposal.title}</h3>
                    <p className="text-sm text-slate-600">by {proposal.author} • {proposal.location}</p>
                  </div>
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status}
                  </Badge>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {proposal.description}
                </p>

                {/* Seed Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Seed Funding Progress</span>
                    <span className="text-sm text-slate-600">
                      {proposal.seedsRaised} / {proposal.seedsRequired} seeds
                    </span>
                  </div>
                  <Progress 
                    value={(proposal.seedsRaised / proposal.seedsRequired) * 100} 
                    className="h-3"
                  />
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                    <span>{proposal.supporters} supporters</span>
                    <span>{proposal.daysLeft} days left</span>
                  </div>
                </div>

                {/* Expected Impact */}
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded mb-4">
                  <div className="font-semibold text-green-600">{proposal.impact}</div>
                  <div className="text-xs text-slate-500">Expected Impact</div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <button className="flex items-center space-x-1 hover:text-slate-700">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Support</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-slate-700">
                      <MessageCircle className="h-4 w-4" />
                      <span>Discuss</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-slate-700">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => supportProposal(proposal.id, 10)}
                      disabled={userSeeds < 10}
                    >
                      <Coins className="h-4 w-4 mr-1" />
                      Plant 10 Seeds
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => supportProposal(proposal.id, 50)}
                      disabled={userSeeds < 50}
                    >
                      <Sprout className="h-4 w-4 mr-1" />
                      Plant 50 Seeds
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earn Seeds */}
      <Card>
        <CardHeader>
          <CardTitle>Earn Seeds for Climate Action</CardTitle>
          <CardDescription>
            Complete actions to earn seeds and grow your impact in the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {seedEarningActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                    <action.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{action.action}</div>
                    <div className="text-sm text-slate-500">{action.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    +{action.seeds} seeds
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => earnSeeds(action)}>
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Growth for passed project */}
      {project && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-500" />
              Project: {project.name || "Climate Initiative"}
            </CardTitle>
            <CardDescription>
              Your seeds help this project grow from idea to implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <Sprout className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <div className="text-lg font-semibold mb-2">Growing Strong!</div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                This project has received community support and is progressing toward implementation.
              </p>
              {seedsPlanted > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-green-700 dark:text-green-300">
                    You've planted {seedsPlanted} seeds to support this project!
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
