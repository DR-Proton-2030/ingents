"use client";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { 
  PenSquare, 
  Sparkles, 
  Share2, 
  Clock, 
  ArrowRight,
  Image,
  Video,
  FileText,
  Zap
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import AuthContext from "@/contexts/authContext/authContext";

export default function CreatePostCTA() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useContext(AuthContext);

  // Check connected platforms
  const connectedPlatforms = [];
  if ((user as any)?.youtube?.access_token) connectedPlatforms.push("youtube");
  if ((user as any)?.facebook?.access_token || (user as any)?.facebook?.page_id) connectedPlatforms.push("facebook");
  if ((user as any)?.instagram?.access_token) connectedPlatforms.push("instagram");
  if ((user as any)?.x?.access_token) connectedPlatforms.push("x");

  const handleCreatePost = () => {
    router.push(`${pathname}/create-post`);
  };

  const features = [
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "Multi-Platform",
      description: "Post to all platforms at once",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Schedule",
      description: "Plan your content calendar",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI Assist",
      description: "Smart recommendations",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const platformIcons = {
    youtube: { icon: <FaYoutube className="w-4 h-4" />, color: "text-red-500", bg: "bg-red-50" },
    facebook: { icon: <FaFacebook className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50" },
    instagram: { icon: <FaInstagram className="w-4 h-4" />, color: "text-pink-500", bg: "bg-pink-50" },
    x: { icon: <FaXTwitter className="w-4 h-4" />, color: "text-gray-800", bg: "bg-gray-100" },
  };

  return (
    <div className="space-y-5">
      {/* Main CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-50 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-xl">
                <PenSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Create New Post</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  Share content across your connected platforms
                </p>
              </div>
            </div>
            
            {/* Quick action button */}
            <button
              onClick={handleCreatePost}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all group"
            >
              <Zap className="w-4 h-4" />
              Quick Post
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Connected Platforms */}
          {connectedPlatforms.length > 0 && (
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Post to
              </span>
              <div className="flex items-center gap-2">
                {connectedPlatforms.map((platform) => {
                  const config = platformIcons[platform as keyof typeof platformIcons];
                  return (
                    <div
                      key={platform}
                      className={`p-2 rounded-lg ${config.bg} ${config.color}`}
                    >
                      {config.icon}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile button */}
          <button
            onClick={handleCreatePost}
            className="sm:hidden w-full mt-5 flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
          >
            <PenSquare className="w-4 h-4" />
            Create Post
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
            onClick={handleCreatePost}
          >
            <div className={`p-2 rounded-lg w-fit ${feature.bg} ${feature.color} mb-3 group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">{feature.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Content Types Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-100"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Supported
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600">
              <FileText className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Text</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600">
              <Image className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Image</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600">
              <Video className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Video</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCreatePost}
          className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors"
        >
          Start creating
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* No Platforms Warning */}
      {connectedPlatforms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4"
        >
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800 text-sm">
              No Platforms Connected
            </h3>
            <p className="text-xs text-amber-600">
              Connect your social accounts above to start posting
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
