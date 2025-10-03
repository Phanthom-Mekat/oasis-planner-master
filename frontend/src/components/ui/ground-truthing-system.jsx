"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Coins
} from "lucide-react";

export function GroundTruthingSystem() {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Broken shade structure at Central Park",
      description: "The main shade pavilion has damaged roof panels, creating safety hazard during hot weather.",
      reporter: {
        name: "Sarah Chen",
        avatar: "/api/placeholder/40/40",
        seeds: 150
      },
      location: "Central Park, Sector 4",
      timestamp: "2 hours ago",
      image: "/api/placeholder/400/300",
      status: "pending",
      verifications: 0,
      required: 3,
      category: "Infrastructure"
    },
    {
      id: 2, 
      title: "New heat island forming on Main Street",
      description: "Temperature feels significantly higher between 2-4 PM due to lack of shade trees. Multiple residents reporting discomfort.",
      reporter: {
        name: "Marcus Rodriguez",
        avatar: "/api/placeholder/40/40",
        seeds: 89
      },
      location: "Main Street, Block 12-15",
      timestamp: "4 hours ago",
      image: "/api/placeholder/400/300",
      status: "verified",
      verifications: 4,
      required: 3,
      category: "Climate"
    },
    {
      id: 3,
      title: "Drainage issues causing flood risk",
      description: "Storm drain clogged with debris, water pooling during moderate rainfall creating pedestrian hazard.",
      reporter: {
        name: "Elena Vasquez", 
        avatar: "/api/placeholder/40/40",
        seeds: 203
      },
      location: "Industrial District, 5th Avenue",
      timestamp: "6 hours ago",
      image: "/api/placeholder/400/300",
      status: "disputed", 
      verifications: 1,
      required: 3,
      category: "Flooding"
    }
  ]);

  const [userVerifications, setUserVerifications] = useState({});

  const verifyReport = (reportId, isAccurate) => {
    setUserVerifications(prev => ({
      ...prev,
      [reportId]: isAccurate
    }));

    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const newVerifications = report.verifications + 1;
        let newStatus = report.status;
        
        if (newVerifications >= report.required) {
          newStatus = isAccurate ? 'verified' : 'disputed';
        }
        
        return {
          ...report,
          verifications: newVerifications,
          status: newStatus
        };
      }
      return report;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Infrastructure': return 'text-blue-600 bg-blue-50';
      case 'Climate': return 'text-orange-600 bg-orange-50';
      case 'Flooding': return 'text-cyan-600 bg-cyan-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Community Ground-Truthing
          </CardTitle>
          <CardDescription>
            Help verify community reports and earn seeds for accurate verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-blue-700">Reports This Week</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-green-700">Verification Accuracy</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">+20 🌰</div>
              <div className="text-sm text-yellow-700">Seeds Per Verification</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report Image */}
                  <div className="lg:col-span-1">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={report.image}
                        alt="Report evidence"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getCategoryColor(report.category)}>
                          {report.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {report.title}
                        </h3>
                        <p className="text-slate-600 mb-3">
                          {report.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>

                    {/* Reporter Info */}
                    <div className="flex items-center space-x-3 py-3 border-t border-b">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={report.reporter.avatar} />
                        <AvatarFallback>{report.reporter.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{report.reporter.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {report.reporter.seeds} 🌰
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{report.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Verification Progress: </span>
                          <span className={`${
                            report.verifications >= report.required ? 'text-green-600' : 'text-slate-600'
                          }`}>
                            {report.verifications}/{report.required} required
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span>+20 seeds for verification</span>
                        </div>
                      </div>

                      {/* Verification Actions */}
                      {!userVerifications[report.id] && report.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => verifyReport(report.id, true)}
                            className="flex items-center space-x-1"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>Accurate</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyReport(report.id, false)}
                            className="flex items-center space-x-1"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>Inaccurate</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Flag className="h-4 w-4" />
                            <span>Report Issue</span>
                          </Button>
                        </div>
                      )}

                      {userVerifications[report.id] !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-3 rounded-lg ${
                            userVerifications[report.id] 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-red-50 border border-red-200'
                          }`}
                        >
                          <div className={`text-sm font-medium ${
                            userVerifications[report.id] ? 'text-green-800' : 'text-red-800'
                          }`}>
                            ✓ Thank you for your verification!
                          </div>
                          <div className={`text-xs ${
                            userVerifications[report.id] ? 'text-green-600' : 'text-red-600'
                          }`}>
                            You marked this report as {userVerifications[report.id] ? 'accurate' : 'inaccurate'} 
                            and earned 20 seeds 🌰
                          </div>
                        </motion.div>
                      )}

                      {report.status === 'verified' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Report verified by community - forwarded to city officials
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Report Button */}
      <Card className="border-dashed border-2 border-slate-300">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Camera className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Report a Local Issue</h3>
              <p className="text-sm text-slate-600 mb-4">
                Help your community by reporting climate-related issues with photo evidence
              </p>
              <Button>
                <Camera className="h-4 w-4 mr-2" />
                Create New Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
