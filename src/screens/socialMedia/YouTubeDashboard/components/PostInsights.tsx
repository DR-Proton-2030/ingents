"use client";
import React from "react";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const reachData = [
  { v: 40 }, { v: 70 }, { v: 50 }, { v: 90 }, { v: 60 }, { v: 100 }, { v: 80 }
];

const followerData = [
  { v: 30 }, { v: 40 }, { v: 60 }, { v: 80 }, { v: 50 }
];

const PostInsights = () => {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Insights</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Posted on May 10, 2024 - 6:10pm</p>
        </div>
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop" className="w-12 h-8 rounded-lg object-cover" alt="" />
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 mb-1">Accounts reached</p>
            <h2 className="text-2xl font-bold text-gray-900">5,192,879</h2>
          </div>
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reachData}>
                <Bar dataKey="v" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 mb-1">Subscribers</p>
            <h2 className="text-2xl font-bold text-gray-900">+2,953</h2>
          </div>
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={followerData}>
                <Bar dataKey="v" fill="#d946ef" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-900 mb-2">Unique Finding</h4>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-4">
            You have gained more reach and followers when the post is related to workspace or productivity. Keep it up!
          </p>
          <button className="text-blue-500 border border-blue-500 rounded-full px-4 py-2 text-[10px] font-bold hover:bg-blue-50 transition-colors w-full">
            Subscribe for another finding
          </button>
        </div>
        <div className="w-20 flex items-center justify-center">
            {/* Minimal Illustration placeholder */}
            <div className="relative w-full aspect-square bg-yellow-50 rounded-2xl flex items-center justify-center">
                 <div className="w-8 h-12 bg-red-400 rounded-lg absolute bottom-2 right-2 animate-bounce" style={{ animationDuration: '3s' }} />
                 <div className="w-10 h-10 bg-blue-500 rounded-full absolute -top-1 -left-1" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostInsights;

