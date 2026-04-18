"use client";
import React from "react";
import { motion } from "framer-motion";

export const Integrations: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 gap-4 max-w-2xl"
        >
            {[
                { name: "Notion", desc: "Sync your project notes and documentation.", icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", status: "Connected" },
                { name: "Slack", desc: "Instant notifications for team activity.", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", status: "Connected" },
                { name: "Drive", desc: "Backup your assets to Google Drive.", icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg", status: "Disconnect" }
            ].map((int, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-gray-200 transition-all">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-3">
                            <img src={int.icon} alt={int.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-gray-900">{int.name}</h3>
                            <p className="text-sm text-gray-500">{int.desc}</p>
                        </div>
                    </div>
                    <button className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${int.status === "Connected"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-black"
                        }`}>
                        {int.status}
                    </button>
                </div>
            ))}
        </motion.div>
    );
};
