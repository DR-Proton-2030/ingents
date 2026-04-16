"use client";
import React from "react";
import Layout from "@/screens/layout/Layout";
import { Flag, AddCircle, Magnifer } from "@solar-icons/react";

const Campaigns: React.FC = () => {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-500 text-sm">Manage and track your marketing campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-64"
              />
            </div>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/20">
              <AddCircle className="w-5 h-5" />
              Create Campaign
            </button>
          </div>
        </div>

        {/* Empty State / Placeholder */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-2">
            <Flag className="w-10 h-10" iconStyle="Bold" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No active campaigns</h2>
          <p className="text-gray-500 max-w-md">
            Start reaching your audience today. Create your first campaign to boost your brand visibility and engagement.
          </p>
          <button className="text-orange-600 font-medium hover:underline">
            Learn how to create effective campaigns
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Campaigns;
