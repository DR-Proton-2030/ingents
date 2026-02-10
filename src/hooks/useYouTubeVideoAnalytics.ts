import { useState, useEffect, useCallback } from "react";
import { getVideoAnalytics } from "@/service/youtube/youtube.service";
import { toast } from "react-toastify";

export const useYouTubeVideoAnalytics = (userId: string | undefined, videoId: string | undefined, dateRange: string = "LAST_28_DAYS") => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!userId || !videoId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getVideoAnalytics(userId, videoId, dateRange);
      if (response.success) {
        setData(response.result);
      } else {
        setError(response.message || "Failed to fetch video analytics");
        toast.error(response.message || "Failed to fetch video analytics");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userId, videoId, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
};
