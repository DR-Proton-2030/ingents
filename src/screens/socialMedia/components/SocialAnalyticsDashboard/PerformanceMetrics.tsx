"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface PerformanceMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
  title?: string;
}

export default function PerformanceMetrics({
  metrics,
  title = "Performance",
}: PerformanceMetricsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              {metric.icon}
              <span className="text-sm text-slate-500">{metric.label}</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-slate-800">
                {metric.value}
              </span>
              <div
                className={`flex items-center gap-1 text-sm ${
                  metric.change >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {metric.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
