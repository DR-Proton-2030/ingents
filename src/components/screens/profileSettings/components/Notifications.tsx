"use client";
import React from "react";
import { motion } from "framer-motion";

export const Notifications: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 max-w-2xl"
        >
            {[
                { title: "Email Notifications", desc: "Receive email updates on project activity." },
                { title: "Push Notifications", desc: "Get desktop alerts for new tasks." },
                { title: "Desktop Notifications", desc: "Show alerts when the browser is minimized." },
                { title: "Marketing Emails", desc: "Receive news, tips and product updates." }
            ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-[2rem] hover:shadow-lg hover:shadow-gray-100/50 transition-all">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900">{n.title}</h3>
                        <p className="text-sm text-gray-500">{n.desc}</p>
                    </div>
                    <button className="w-12 h-6 bg-gray-100 rounded-full relative p-1 flex items-center justify-start group">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                </div>
            ))}
        </motion.div>
    );
};
