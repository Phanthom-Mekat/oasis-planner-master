"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Sidebar from "@/components/dashboard/Sidebar";
import NotificationSystem from "@/components/ui/notification-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CivicGarden } from "@/components/ui/civic-garden";
import { GroundTruthingSystem } from "@/components/ui/ground-truthing-system";
import { useAppStore } from "@/lib/store";
import { 
  Users, 
  MessageSquare,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Trophy,
  Star,
  TrendingUp,
  Globe,
  Bell,
  Search,
  Menu,
  Plus,
  Filter
} from "lucide-react";

export default function CommunityPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const { selectedCity } = useAppStore();

  const communityStats = [
    {
      title: "Active Members",
      value: "2,847",
      change: "+127 this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Projects Funded",
      value: "18",
      change: "+3 this month",
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Raised",
      value: "$45,200",
      change: "+$8,500 this month",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Events Hosted",
      value: "12",
      change: "+2 this week",
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  const communityPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        avatar: "/api/placeholder/40/40",
        role: "Climate Activist"
      },
      content: "Amazing progress on the Urban Forest Initiative! We've planted 650 trees so far. The community response has been incredible. 🌳",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      image: "/api/placeholder/500/300"
    },
    {
      id: 2,
      author: {
        name: "Marcus Rodriguez",
        avatar: "/api/placeholder/40/40",
        role: "Environmental Engineer"
      },
      content: "New research shows our green corridor project could reduce city temperatures by up to 3°C. Excited to share the full report next week!",
      timestamp: "4 hours ago",
      likes: 31,
      comments: 12,
      shares: 7
    },
    {
      id: 3,
      author: {
        name: "City of Dhaka",
        avatar: "/api/placeholder/40/40",
        role: "Official Account"
      },
      content: "Join us this Saturday for the Community Climate Action Day! We'll be installing solar panels and planting native species. Location: Central Park, 9 AM",
      timestamp: "6 hours ago",
      likes: 67,
      comments: 23,
      shares: 15,
      image: "/api/placeholder/500/200"
    }
  ];

  const upcomingEvents = [
    {
      title: "Climate Action Day",
      date: "Dec 15, 2024",
      time: "9:00 AM",
      location: "Central Park",
      attendees: 234,
      type: "Community Event"
    },
    {
      title: "Green Tech Workshop",
      date: "Dec 18, 2024", 
      time: "2:00 PM",
      location: "Innovation Hub",
      attendees: 67,
      type: "Workshop"
    },
    {
      title: "Urban Planning Forum",
      date: "Dec 22, 2024",
      time: "6:00 PM", 
      location: "City Hall",
      attendees: 145,
      type: "Forum"
    }
  ];

  const tabs = [
    { id: "feed", label: "Community Feed" },
    { id: "projects", label: "Projects" },
    { id: "verify", label: "Ground Truth" },
    { id: "events", label: "Events" },
    { id: "leaderboard", label: "Leaderboard" }
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <NotificationSystem />
      
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Community Portal
                </h1>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe className="h-4 w-4" />
                  <span>{selectedCity.name}, {selectedCity.country}</span>
                  <Badge variant="outline" className="text-xs">
                    2,847 Members
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search community..."
                  className="bg-transparent text-sm outline-none w-48 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {stat.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {stat.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex space-x-1">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Feed/Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="xl:col-span-2 space-y-6"
              >
                {activeTab === "feed" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Feed</CardTitle>
                      <CardDescription>
                        Latest updates from your climate community
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {communityPosts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 pb-6 last:pb-0"
                          >
                            <div className="flex space-x-3">
                              <Avatar>
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {post.author.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {post.author.role}
                                  </Badge>
                                  <span className="text-sm text-slate-500">
                                    {post.timestamp}
                                  </span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-3">
                                  {post.content}
                                </p>
                                {post.image && (
                                  <div className="mb-3 rounded-lg overflow-hidden">
                                    <Image 
                                      src={post.image} 
                                      alt="Post content"
                                      width={500}
                                      height={200}
                                      className="w-full h-48 object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex items-center space-x-6 text-sm text-slate-500">
                                  <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likes}</span>
                                  </button>
                                  <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.comments}</span>
                                  </button>
                                  <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                                    <Share2 className="h-4 w-4" />
                                    <span>{post.shares}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "verify" && (
                  <GroundTruthingSystem />
                )}
              </motion.div>

              {/* Sidebar Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-6"
              >
                {/* Civic Garden */}
                <CivicGarden project={{ 
                  name: "Urban Forest Initiative", 
                  totalSeeds: 245 
                }} />

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                {event.title}
                              </h4>
                              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{event.date} at {event.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>{event.attendees} attending</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Contributors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Top Contributors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Sarah Chen", points: 1250, avatar: "/api/placeholder/32/32" },
                        { name: "Marcus Rodriguez", points: 980, avatar: "/api/placeholder/32/32" },
                        { name: "Elena Vasquez", points: 875, avatar: "/api/placeholder/32/32" },
                        { name: "James Liu", points: 720, avatar: "/api/placeholder/32/32" }
                      ].map((contributor, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="text-sm font-medium w-4">
                            #{index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contributor.avatar} />
                            <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{contributor.name}</div>
                            <div className="text-xs text-slate-500">{contributor.points} points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
