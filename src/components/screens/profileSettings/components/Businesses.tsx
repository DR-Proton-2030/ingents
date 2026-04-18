"use client";
import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export const Businesses: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-2 gap-6">
                {[
                    { name: "Filllo Agency", role: "Owner", members: 24 },
                    { name: "Ingents Ltd", role: "Admin", members: 12 }
                ].map((b, i) => (
                    <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] space-y-6 hover:shadow-xl hover:shadow-gray-200/20 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase">
                                {b.name[0]}
                            </div>
                            <span className="px-4 py-1.5 bg-gray-100 text-gray-900 text-xs font-bold rounded-full">
                                {b.role}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900">{b.name}</h3>
                            <p className="text-sm text-gray-500">{b.members} Team Members</p>
                        </div>
                    </div>
                ))}
                <button className="p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center space-y-3 hover:border-gray-300 hover:bg-gray-50/50 transition-all group">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="font-bold text-gray-900">Add New Business</span>
                </button>
            </div>
        </motion.div>
    );
};
