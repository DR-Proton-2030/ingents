"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { X, TrendingUp, FileText, Video, Image } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import axios from "axios";

// Platform brand colors
const PLATFORM_COLORS = {
  youtube: {
    gradient: "from-red-500 to-red-400",
    hover: "from-red-600 to-red-500",
    dot: "bg-red-500",
    solid: "bg-red-500",
    text: "text-red-500",
    label: "YouTube",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  facebook: {
    gradient: "from-blue-600 to-blue-500",
    hover: "from-blue-700 to-blue-600",
    dot: "bg-blue-600",
    solid: "bg-blue-600",
    text: "text-blue-600",
    label: "Facebook",
    icon: <FaFacebook className="w-5 h-5" />,
  },
  instagram: {
    gradient: "from-pink-500 to-purple-500",
    hover: "from-pink-600 to-purple-600",
    dot: "bg-gradient-to-r from-pink-500 to-purple-500",
    solid: "bg-pink-500",
    text: "text-pink-500",
    label: "Instagram",
    icon: <FaInstagram className="w-5 h-5" />,
  },
  x: {
    gradient: "from-gray-800 to-gray-700",
    hover: "from-gray-900 to-gray-800",
    dot: "bg-gray-800",
    solid: "bg-gray-800",
    text: "text-gray-800",
    label: "X (Twitter)",
    icon: <FaXTwitter className="w-5 h-5" />,
  },
};

export interface PlatformMonthlyData {
  month: string;
  monthIndex?: number;
  year?: number;
  youtube: number;
  facebook: number;
  instagram: number;
  x: number;
}

interface MonthlyPostDetail {
  platform: string;
  posts: any[];
  count: number;
  videos: number;
  images: number;
  text: number;
}

export interface PlatformGrowthChartProps {
  dateRange?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

const getMonthName = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short" });
};

const getLast8Months = (): string[] => {
  const months: string[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(getMonthName(date));
  }
  return months;
};

export default function PlatformGrowthChart({
  dateRange = "Last 25 Days",
}: PlatformGrowthChartProps) {
  const { user } = useContext(AuthContext);
  const [hoveredBar, setHoveredBar] = useState<{
    month: number;
    platform: string;
  } | null>(null);
  const [monthlyData, setMonthlyData] = useState<PlatformMonthlyData[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([
    "youtube",
    "facebook",
    "instagram",
    "x",
  ]);
  const [selectedMonth, setSelectedMonth] =
    useState<PlatformMonthlyData | null>(null);
  const [monthDetails, setMonthDetails] = useState<MonthlyPostDetail[]>([]);

  // Fetch posted content and aggregate by platform/month
  useEffect(() => {
    const fetchData = async () => {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const baseURL =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
        const response = await axios.get(
          `${baseURL}/api/v1/scheduler/posted/${userId}`,
        );

        const posts = response.data?.data || [];
        setAllPosts(posts);
        const months = getLast8Months();
        const now = new Date();

        // Initialize monthly data
        const aggregated: Record<string, PlatformMonthlyData> = {};
        months.forEach((month, idx) => {
          const date = new Date(
            now.getFullYear(),
            now.getMonth() - (7 - idx),
            1,
          );
          aggregated[month] = {
            month,
            monthIndex: date.getMonth(),
            year: date.getFullYear(),
            youtube: 0,
            facebook: 0,
            instagram: 0,
            x: 0,
          };
        });

        // Aggregate posts by month and platform
        posts.forEach((post: any) => {
          const postDate = new Date(post.posted_at || post.createdAt);
          const monthName = getMonthName(postDate);

          if (aggregated[monthName] && post.platform) {
            let platform = post.platform.toLowerCase();
            // Normalize instagram_business to instagram
            if (platform === "instagram_business") {
              platform = "instagram";
            }

            if (platform in aggregated[monthName]) {
              (aggregated[monthName] as any)[platform]++;
            }
          }
        });

        setMonthlyData(months.map((month) => aggregated[month]));
      } catch (error) {
        console.error("Error fetching posted content:", error);
        // Use mock data on error
        setMonthlyData(
          getLast8Months().map((month, idx) => {
            const now = new Date();
            const date = new Date(
              now.getFullYear(),
              now.getMonth() - (7 - idx),
              1,
            );
            return {
              month,
              monthIndex: date.getMonth(),
              year: date.getFullYear(),
              youtube: Math.floor(Math.random() * 15) + 2,
              facebook: Math.floor(Math.random() * 12) + 3,
              instagram: Math.floor(Math.random() * 20) + 5,
              x: Math.floor(Math.random() * 10) + 1,
            };
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const maxValue = useMemo(() => {
    if (monthlyData.length === 0) return 100;
    let max = 0;
    monthlyData.forEach((data) => {
      const total = activePlatforms.reduce((sum, p) => {
        return sum + (data[p as keyof Omit<PlatformMonthlyData, "month">] || 0);
      }, 0);
      if (total > max) max = total;
    });
    return max || 100;
  }, [monthlyData, activePlatforms]);

  const togglePlatform = (platform: string) => {
    setActivePlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  // Calculate Y-axis labels dynamically
  const yAxisLabels = useMemo(() => {
    const step = Math.ceil(maxValue / 4);
    return [
      maxValue,
      Math.ceil(maxValue * 0.75),
      Math.ceil(maxValue * 0.5),
      Math.ceil(maxValue * 0.25),
    ];
  }, [maxValue]);

  // Handle month click - show detailed breakdown
  const handleMonthClick = (data: PlatformMonthlyData) => {
    setSelectedMonth(data);

    // Filter posts for the selected month
    const monthPosts = allPosts.filter((post: any) => {
      const postDate = new Date(post.posted_at || post.createdAt);
      return (
        postDate.getMonth() === data.monthIndex &&
        postDate.getFullYear() === data.year
      );
    });

    // Group by platform
    const platforms = ["youtube", "facebook", "instagram", "x"];
    const details: MonthlyPostDetail[] = platforms.map((platform) => {
      const platformPosts = monthPosts.filter(
        (p: any) => p.platform?.toLowerCase() === platform,
      );
      return {
        platform,
        posts: platformPosts,
        count: platformPosts.length,
        videos: platformPosts.filter((p: any) => p.media_type === "video")
          .length,
        images: platformPosts.filter((p: any) => p.media_type === "image")
          .length,
        text: platformPosts.filter(
          (p: any) => p.media_type === "text" || !p.media_type,
        ).length,
      };
    });

    setMonthDetails(details);
  };

  const closeModal = () => {
    setSelectedMonth(null);
    setMonthDetails([]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-40 mb-6" />
        <div className="h-[200px] bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 p-6"
    >
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Content by Platform
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(PLATFORM_COLORS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => togglePlatform(key)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                activePlatforms.includes(key) ? "opacity-100" : "opacity-40"
              } hover:opacity-100`}
            >
              <div className={`w-3 h-3 rounded-full ${value.dot}`} />
              <span className="text-sm text-slate-600">{value.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Y-axis labels and chart */}
      <div className="flex">
        <div
          className="flex flex-col justify-between text-xs text-slate-400 pr-4 py-2"
          style={{ height: 200 }}
        >
          {yAxisLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        {/* Bars */}
        <div
          className="flex-1 flex items-end justify-between gap-2 relative"
          style={{ height: 200 }}
        >
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="border-b border-dashed border-slate-100"
              />
            ))}
          </div>

          {monthlyData.map((data, monthIndex) => {
            // Stack the platforms
            const platformOrder = [
              "x",
              "instagram",
              "facebook",
              "youtube",
            ].filter((p) => activePlatforms.includes(p));
            const totalPosts = platformOrder.reduce(
              (sum, p) =>
                sum +
                (data[
                  p as keyof Omit<
                    PlatformMonthlyData,
                    "month" | "monthIndex" | "year"
                  >
                ] || 0),
              0,
            );

            return (
              <div
                key={data.month}
                className="flex flex-col items-center flex-1 relative z-10 cursor-pointer group"
                onClick={() => handleMonthClick(data)}
              >
                <div className="w-full flex flex-col items-center">
                  {/* Stacked bar or empty placeholder */}
                  <div className="w-full max-w-[40px] flex flex-col-reverse group-hover:scale-105 transition-transform">
                    {totalPosts === 0 ? (
                      /* Empty month - show grey placeholder bar */
                      <div
                        className="relative"
                        onMouseEnter={() =>
                          setHoveredBar({
                            month: monthIndex,
                            platform: "empty",
                          })
                        }
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {/* No content tooltip */}
                        {hoveredBar?.month === monthIndex &&
                          hoveredBar?.platform === "empty" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                            >
                              No content
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-600" />
                            </motion.div>
                          )}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "40px" }}
                          transition={{
                            delay: 0.3 + monthIndex * 0.05,
                            duration: 0.5,
                          }}
                          className="w-full bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
                        />
                      </div>
                    ) : (
                      /* Has posts - show stacked bars */
                      platformOrder.map((platform, platformIndex) => {
                        const value =
                          data[
                            platform as keyof Omit<
                              PlatformMonthlyData,
                              "month" | "monthIndex" | "year"
                            >
                          ] || 0;
                        const height =
                          maxValue > 0 ? (value / maxValue) * 160 : 0;
                        const colors =
                          PLATFORM_COLORS[
                            platform as keyof typeof PLATFORM_COLORS
                          ];
                        const isFirst = platformIndex === 0;
                        const isLast =
                          platformIndex === platformOrder.length - 1;
                        const isHovered =
                          hoveredBar?.month === monthIndex &&
                          hoveredBar?.platform === platform;

                        return (
                          <div key={platform} className="relative">
                            {/* Tooltip */}
                            {isHovered && value > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                              >
                                {colors.label}: {value} posts
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800" />
                              </motion.div>
                            )}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}px` }}
                              transition={{
                                delay:
                                  0.3 +
                                  monthIndex * 0.05 +
                                  platformIndex * 0.02,
                                duration: 0.5,
                              }}
                              onMouseEnter={() =>
                                setHoveredBar({ month: monthIndex, platform })
                              }
                              onMouseLeave={() => setHoveredBar(null)}
                              className={`w-full bg-gradient-to-t ${
                                isHovered ? colors.hover : colors.gradient
                              } cursor-pointer transition-colors ${
                                isLast ? "rounded-t-lg" : ""
                              } ${isFirst ? "rounded-b-lg" : ""}`}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 mt-3 group-hover:text-slate-800 group-hover:font-medium transition-colors">
                  {data.month}
                </span>
                {/* Click hint on hover */}
                {totalPosts > 0 && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] text-indigo-500 whitespace-nowrap">
                      Click for details
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(PLATFORM_COLORS).map(([key, value]) => {
            const total = monthlyData.reduce(
              (sum, data) =>
                sum +
                (data[
                  key as keyof Omit<
                    PlatformMonthlyData,
                    "month" | "monthIndex" | "year"
                  >
                ] || 0),
              0,
            );
            return (
              <div key={key} className="text-center">
                <div
                  className={`inline-flex items-center gap-1.5 ${
                    activePlatforms.includes(key) ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${value.dot}`} />
                  <span className="text-lg font-bold text-slate-800">
                    {total}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Total Posts</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month Detail Modal */}
      <AnimatePresence>
        {selectedMonth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedMonth.month} {selectedMonth.year} Overview
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Detailed breakdown of your content performance
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Platform Breakdown Chart */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Platform Breakdown
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {monthDetails.map((detail) => {
                      const colors =
                        PLATFORM_COLORS[
                          detail.platform as keyof typeof PLATFORM_COLORS
                        ];
                      const maxCount = Math.max(
                        ...monthDetails.map((d) => d.count),
                        1,
                      );
                      const barHeight = (detail.count / maxCount) * 100;

                      return (
                        <div key={detail.platform} className="text-center">
                          <div className="h-32 flex items-end justify-center mb-2">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${barHeight}%` }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                              className={`w-12 bg-gradient-to-t ${colors.gradient} rounded-t-lg min-h-[4px]`}
                            />
                          </div>
                          <div className={`${colors.text} mb-1`}>
                            {colors.icon}
                          </div>
                          <div className="text-2xl font-bold text-slate-800">
                            {detail.count}
                          </div>
                          <div className="text-xs text-slate-500">
                            {colors.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Content Type Breakdown */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Content Types
                  </h4>
                  <div className="space-y-3">
                    {monthDetails
                      .filter((d) => d.count > 0)
                      .map((detail) => {
                        const colors =
                          PLATFORM_COLORS[
                            detail.platform as keyof typeof PLATFORM_COLORS
                          ];
                        return (
                          <div
                            key={detail.platform}
                            className="bg-slate-50 rounded-xl p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`${colors.text}`}>
                                {colors.icon}
                              </div>
                              <span className="font-medium text-slate-800">
                                {colors.label}
                              </span>
                              <span className="text-sm text-slate-500 ml-auto">
                                {detail.count} total posts
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                                <Video className="w-4 h-4 text-purple-500" />
                                <div>
                                  <div className="text-sm font-semibold text-slate-800">
                                    {detail.videos}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Videos
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                                <Image className="w-4 h-4 text-green-500" />
                                <div>
                                  <div className="text-sm font-semibold text-slate-800">
                                    {detail.images}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Images
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <div>
                                  <div className="text-sm font-semibold text-slate-800">
                                    {detail.text}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Text
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {monthDetails.every((d) => d.count === 0) && (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>
                          No posts in {selectedMonth.month} {selectedMonth.year}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
