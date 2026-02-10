import { useState, useEffect, useCallback, useRef } from "react";
import { getVideoAnalytics } from "@/service/youtube/youtube.service";
import { toast } from "react-toastify";

export const useYouTubeVideoAnalytics = (userId: string | undefined, videoId: string | undefined, dateRange: string = "LAST_28_DAYS") => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string>("");

  const fetchAnalytics = useCallback(async () => {
    if (!userId || !videoId) return;
    
    // Prevent duplicate calls if params are same
    const fetchKey = `${userId}-${videoId}-${dateRange}`;
    if (lastFetchRef.current === fetchKey) return;
    lastFetchRef.current = fetchKey;

    setLoading(true);
    setError(null);
    try {
      const response = await getVideoAnalytics(userId, videoId, dateRange);
      if (response.success) {
        setData(response.result);
      } else {
        setError(response.message || "Failed to fetch video analytics");
        toast.error(response.message || "Failed to fetch video analytics");
        lastFetchRef.current = ""; // Reset on error to allow retry
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
      lastFetchRef.current = ""; // Reset on error
    } finally {
      setLoading(false);
    }
  }, [userId, videoId, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: () => {
    lastFetchRef.current = "";
    fetchAnalytics();
  }};
};
