"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Camera, 
  MapPin, 
  Users, 
  TreePine, 
  Droplets,
  ThumbsUp,
  Plus,
  Filter,
  Calendar
} from "lucide-react";

const communityPosts = [
  {
    id: 1,
    author: "Anika Patel",
    role: "Community Advocate",
    avatar: "/avatars/anika.jpg",
    timestamp: "2 hours ago",
    type: "proposal",
    title: "Miyawaki Forest for East Side",
    description: "Our neighborhood desperately needs cooling. I&apos;ve designed a tiny forest that could reduce temperatures by 3°C. Let&apos;s make it happen!",
    location: "East Side Neighborhood",
    image: "/proposals/miyawaki-mockup.jpg",
    likes: 47,
    comments: 12,
    shares: 8,
    tags: ["Urban Forest", "Heat Island", "Community"],
    impact: {
      temperature_reduction: "-3.2°C",
      area: "0.3 hectares",
      beneficiaries: "850 residents"
    }
  },
  {
    id: 2,
    author: "Dr. Sarah Chen",
    role: "Climate Scientist",
    avatar: "/avatars/sarah.jpg",
    timestamp: "6 hours ago",
    type: "update",
    title: "Riverside Project Progress Update",
    description: "Great news! The bioswale installation is 65% complete. Early results show 40% reduction in flood risk.",
    location: "Riverside District",
    image: "/updates/bioswale-progress.jpg",
    likes: 23,
    comments: 5,
    shares: 3,
    tags: ["Flood Management", "Progress Update", "Infrastructure"],
    progress: 65
  },
  {
    id: 3,
    author: "Mike Rodriguez",
    role: "Resident",
    avatar: "/avatars/mike.jpg",
    timestamp: "1 day ago",
    type: "issue",
    title: "Severe flooding on Oak Street",
    description: "Another heavy rain, another flood. We need better drainage solutions here. Attaching photos from this morning.",
    location: "Oak Street",
    image: "/issues/oak-street-flood.jpg",
    likes: 31,
    comments: 18,
    shares: 12,
    tags: ["Flooding", "Infrastructure", "Urgent"],
    severity: "High"
  }
];

const proposalTemplates = [
  {
    id: "urban-forest",
    name: "Urban Forest",
    icon: TreePine,
    description: "Dense tree planting for cooling",
    difficulty: "Medium",
    cost: "$$$"
  },
  {
    id: "rain-garden",
    name: "Rain Garden",
    icon: Droplets,
    description: "Natural stormwater management",
    difficulty: "Easy",
    cost: "$"
  },
  {
    id: "cool-pavement",
    name: "Cool Pavement",
    icon: MapPin,
    description: "Heat-reflecting street surfaces",
    difficulty: "Hard",
    cost: "$$$$"
  }
];

export default function CommunityPortal() {
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredPosts = communityPosts.filter(post => 
    selectedFilter === "all" || post.type === selectedFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Community Portal
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Shape your neighborhood&apos;s climate future together
              </p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-80">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All Posts
                </Button>
                <Button
                  variant={selectedFilter === "proposal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("proposal")}
                >
                  Proposals
                </Button>
                <Button
                  variant={selectedFilter === "update" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("update")}
                >
                  Updates
                </Button>
                <Button
                  variant={selectedFilter === "issue" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("issue")}
                >
                  Issues
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                          <div>
                            <p className="font-medium">{post.author}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{post.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{post.timestamp}</p>
                          <Badge variant="outline" className="text-xs">
                            {post.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                        <p className="text-slate-700 dark:text-slate-300">{post.description}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        {post.location}
                      </div>

                      {post.impact && (
                        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-3">
                          <h5 className="font-medium text-sm mb-2">Expected Impact</h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {Object.entries(post.impact).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="font-medium">{value}</div>
                                <div className="text-slate-600 dark:text-slate-400">
                                  {key.replace(/_/g, ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {post.progress && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-slate-600">{post.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                              style={{width: `${post.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Proposal</CardTitle>
                <CardDescription>
                  Use our storytelling tools to rally community support for climate solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {proposalTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="text-center">
                          <Icon className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                          <div className="flex justify-center gap-2">
                            <Badge variant="outline">{template.difficulty}</Badge>
                            <Badge variant="outline">{template.cost}</Badge>
                          </div>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            Start Proposal
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Active Campaigns</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Join ongoing community efforts to improve climate resilience
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse Campaigns
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
