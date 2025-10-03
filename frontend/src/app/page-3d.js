"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Hero3D from "@/components/home/Hero3D";
import FeaturesShowcase from "@/components/home/FeaturesShowcase";
import DataVisualization from "@/components/home/DataVisualization";

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* 3D Hero Section */}
      <Hero3D />
      
      {/* Features Showcase */}
      <FeaturesShowcase />
      
      {/* Data Visualization */}
      <DataVisualization />
      
      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your City?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join urban planners worldwide using OASIS for data-driven climate action
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-blue-500/50"
              >
                Launch Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
