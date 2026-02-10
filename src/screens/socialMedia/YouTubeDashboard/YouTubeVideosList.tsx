"use client";
import React, { useContext, useEffect, useState } from "react";
import Layout from "@/screens/layout/Layout";
import AuthContext from "@/contexts/authContext/authContext";
import { getYoutubeVideos } from "@/service/youtube/youtube.service";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import VideosTable from "./components/VideosTable";
import { ArrowLeft, Play, BarChart2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const YouTubeVideosList = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) return;

      try {
        const response = await getYoutubeVideos(userId);
        if (response.success) {
          setVideos(response.result);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

 if (loading) {
    return (
      <Layout showSidebar={true}>
        <Loading />
      </Layout>
    );
  }

  // Need to adjust pathname to go back to the dashboard
  // If current is /[site]/social-media/youtube/videos, we want /[site]/social-media/youtube
  const dashboardPath = pathname.replace("/videos", "");

  return (
    <Layout>
      <div className="min-h-screen bg-[#EAEEF6] p-4 lg:p-12 font-sans">
        <div className="max-w-[1700px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-6">
            <Link 
              href={dashboardPath}
              className="p-4 rounded-full bg-white shadow-sm border border-gray-100 text-slate-900 hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Your Content</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Full Video Library</p>
            </div>
          </div>

          {/* Videos List */}
          <div className="grid grid-cols-1 gap-8">
            <VideosTable videos={videos} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default YouTubeVideosList;
