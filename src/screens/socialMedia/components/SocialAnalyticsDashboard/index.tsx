"use client";
import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitch,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Eye,
  FileText,
  BarChart3,
  Calendar,
  ChevronDown,
  ExternalLink,
  Link2,
  RefreshCw,
  X,
} from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { usePathname, useRouter } from "next/navigation";

interface PlatformStat {
  id: string;
  name: string;
  icon: React.ReactNode;
  followers: string;
  color: string;
  bgColor: string;
  connected: boolean;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const platformStats: PlatformStat[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="w-6 h-6" />,
    followers: "0",
    color: "text-pink-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    connected: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FaFacebook className="w-6 h-6" />,
    followers: "0",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    connected: false,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <FaYoutube className="w-6 h-6" />,
    followers: "0",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    connected: false,
  },
  {
    id: "x",
    name: "X",
    icon: <FaXTwitter className="w-6 h-6" />,
    followers: "0",
    color: "text-gray-900",
    bgColor: "bg-gray-500/10",
    connected: false,
  },
];

const monthlyData = [
  { month: "Jan", followers: 180000, viewers: 45000 },
  { month: "Feb", followers: 95000, viewers: 25000 },
  { month: "Mar", followers: 78000, viewers: 35000 },
  { month: "Apr", followers: 210000, viewers: 68000 },
  { month: "May", followers: 75000, viewers: 42000 },
  { month: "Jun", followers: 145000, viewers: 55000 },
  { month: "Jul", followers: 95000, viewers: 48000 },
  { month: "Aug", followers: 68000, viewers: 32000 },
];

interface SocialAnalyticsDashboardProps {
  connectedPlatforms?: string[];
  showOnlyStats?: boolean;
  showChartAndMetrics?: boolean;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
}

export default function SocialAnalyticsDashboard({ 
  connectedPlatforms = [],
  showOnlyStats = false,
  showChartAndMetrics = false,
  onConnect,
  onDisconnect,
}: SocialAnalyticsDashboardProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [dateRange, setDateRange] = useState("Last 25 Days");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [stats, setStats] = useState<PlatformStat[]>(platformStats);

  useEffect(() => {
    if (user) {
      const updatedStats = platformStats.map(stat => {
        const platformData = (user as any)?.[stat.id];
        let followers = "0";
        let connected = connectedPlatforms.includes(stat.id);

        if (platformData) {
          if (stat.id === "youtube" && platformData.subscriberCount) {
            followers = formatNumber(parseInt(platformData.subscriberCount));
            connected = true;
          } else if (stat.id === "facebook" && platformData.followers_count) {
            followers = formatNumber(platformData.followers_count);
            connected = true;
          } else if (stat.id === "instagram" && platformData.followers_count) {
            followers = formatNumber(platformData.followers_count);
            connected = true;
          } else if (stat.id === "x" && platformData.followers_count) {
            followers = formatNumber(platformData.followers_count);
            connected = true;
          }
        }

        return { ...stat, followers, connected };
      });
      setStats(updatedStats);
    }
  }, [user, connectedPlatforms]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const maxValue = Math.max(...monthlyData.map(d => d.followers));

  const handleViewDetails = (platformId: string) => {
    const platformData = (user as any)?.[platformId];
    if (platformId === "youtube") {
      router.push(`${pathname}/youtube`);
    } else if (platformId === "facebook") {
      const pageId = platformData?.page_id || platformData?.id;
      router.push(`${pathname}/facebook${pageId ? `?pageId=${pageId}` : ""}`);
    } else if (platformId === "instagram") {
      router.push(`${pathname}/instagram`);
    } else if (platformId === "x") {
      router.push(`${pathname}/x`);
    }
  };

  const handleConnect = (platformId: string) => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
    const userId = (user as any)?._id || (user as any)?.id;
    
    let authURL = "";
    switch (platformId) {
      case "facebook":
        authURL = `${baseURL}/api/v1/facebook/login?user_id=${userId}`;
        break;
      case "instagram":
        authURL = `https://a7b68de5a1df.ngrok-free.app/api/v1/ig/login-instagram?user_id=${userId}`;
        break;
      case "youtube":
        authURL = `${baseURL}/api/v1/youtube/auth?user_id=${userId}`;
        break;
      case "x":
        authURL = `${baseURL}/api/v1/x/login?user_id=${userId}`;
        break;
    }
    
    if (authURL) {
      window.open(authURL, "_blank");
    }
    
    if (onConnect) {
      onConnect(platformId);
    }
  };

  const performanceMetrics: PerformanceMetric[] = [
    { label: "Posts", value: "586", change: -2.0, icon: <FileText className="w-5 h-5 text-slate-400" /> },
    { label: "Likes", value: "12,701", change: 90, icon: <Heart className="w-5 h-5 text-slate-400" /> },
    { label: "Views", value: "25.05K", change: 30, icon: <Eye className="w-5 h-5 text-slate-400" /> },
  ];

  // Only show stats cards (for top section)
  if (showOnlyStats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {stats.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden`}
          >
            <div className={`absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`${platform.color}`}>
                  {platform.icon}
                </div>
                
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {platform.followers}
              </div>
              <div className="text-sm text-slate-500">Followers</div>
              
              {/* Connect or Manage button */}
              {platform.connected ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(platform.id);
                  }}
                  className="mt-3 w-full py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Manage
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(platform.id);
                  }}
                  className={`mt-3 w-full py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                    platform.id === "instagram" ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" :
                    platform.id === "facebook" ? "bg-blue-600 hover:bg-blue-700" :
                    platform.id === "youtube" ? "bg-red-500 hover:bg-red-600" :
                    "bg-gray-800 hover:bg-gray-900"
                  }`}
                >
                  Connect
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Only show chart and metrics (for Analytics tab content)
  if (showChartAndMetrics) {
    return (
      <div className="space-y-6">
        {/* Date Range Selector */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            {dateRange}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Audience Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Audience Growth</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sm text-slate-600">Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-sm text-slate-600">Viewers</span>
              </div>
            </div>
          </div>

          {/* Y-axis labels and chart */}
          <div className="flex">
            <div className="flex flex-col justify-between text-xs text-slate-400 pr-4 py-2" style={{ height: 200 }}>
              <span>200K</span>
              <span>100K</span>
              <span>50K</span>
              <span>10K</span>
            </div>
            
            {/* Bars */}
            <div className="flex-1 flex items-end justify-between gap-2 relative" style={{ height: 200 }}>
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((_, i) => (
                  <div key={i} className="border-b border-dashed border-slate-100" />
                ))}
              </div>
              
              {monthlyData.map((data, index) => (
                <div 
                  key={data.month} 
                  className="flex flex-col items-center flex-1 relative z-10"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {hoveredBar === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                    >
                      Followers: {formatNumber(data.followers)}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800" />
                    </motion.div>
                  )}
                  
                  <div className="w-full flex flex-col items-center gap-0.5">
                    {/* Followers bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.followers / maxValue) * 160}px` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg cursor-pointer hover:from-amber-500 hover:to-amber-400 transition-colors"
                    />
                    {/* Viewers bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.viewers / maxValue) * 160}px` }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-purple-400 to-purple-300 rounded-b-lg cursor-pointer hover:from-purple-500 hover:to-purple-400 transition-colors"
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-3">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance</h3>
          <div className="grid grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
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
                  <span className="text-2xl font-bold text-slate-800">{metric.value}</span>
                  <div className={`flex items-center gap-1 text-sm ${metric.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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
      </div>
    );
  }

  // Default: show everything (for backwards compatibility)
  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          {dateRange}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Platform Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden`}
          >
            <div className={`absolute inset-0 ${platform.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative">
              <div className={`${platform.color} mb-3`}>
                {platform.icon}
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {platform.followers}
              </div>
              <div className="text-sm text-slate-500">Followers</div>
              {!platform.connected && (
                <div className="absolute top-0 right-0">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                    Not Connected
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs text-slate-500 hover:text-slate-700">•••</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Audience Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-100 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Audience Growth</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-sm text-slate-600">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-sm text-slate-600">Viewers</span>
            </div>
          </div>
        </div>

        {/* Y-axis labels and chart */}
        <div className="flex">
          <div className="flex flex-col justify-between text-xs text-slate-400 pr-4 py-2" style={{ height: 200 }}>
            <span>200K</span>
            <span>100K</span>
            <span>50K</span>
            <span>10K</span>
          </div>
          
          {/* Bars */}
          <div className="flex-1 flex items-end justify-between gap-2 relative" style={{ height: 200 }}>
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((_, i) => (
                <div key={i} className="border-b border-dashed border-slate-100" />
              ))}
            </div>
            
            {monthlyData.map((data, index) => (
              <div 
                key={data.month} 
                className="flex flex-col items-center flex-1 relative z-10"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                  >
                    Followers: {formatNumber(data.followers)}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800" />
                  </motion.div>
                )}
                
                <div className="w-full flex flex-col items-center gap-0.5">
                  {/* Followers bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.followers / maxValue) * 160}px` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg cursor-pointer hover:from-amber-500 hover:to-amber-400 transition-colors"
                  />
                  {/* Viewers bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.viewers / maxValue) * 160}px` }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-purple-400 to-purple-300 rounded-b-lg cursor-pointer hover:from-purple-500 hover:to-purple-400 transition-colors"
                  />
                </div>
                <span className="text-xs text-slate-500 mt-3">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                {metric.icon}
                <span className="text-sm text-slate-500">{metric.label}</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-slate-800">{metric.value}</span>
                <div className={`flex items-center gap-1 text-sm ${metric.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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
    </div>
  );
}
