import { useState, useEffect, useCallback, useRef } from "react";
import { getChannelDetails } from "@/service/youtube/youtube.service";
import { toast } from "react-toastify";

export const useYouTubeDetails = (userId: string | undefined, dateRange: string = "LAST_28_DAYS") => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string>("");

  const fetchDetails = useCallback(async () => {
    if (!userId) return;
    
    // Prevent duplicate calls
    const fetchKey = `${userId}-${dateRange}`;
    if (lastFetchRef.current === fetchKey) return;
    lastFetchRef.current = fetchKey;

    setLoading(true);
    setError(null);
    try {
      const response = await getChannelDetails(userId, dateRange);
      if (response.success) {
        setData(response.result);
      } else {
        setError(response.message || "Failed to fetch YouTube details");
        toast.error(response.message || "Failed to fetch YouTube details");
        lastFetchRef.current = ""; // Reset on error
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
      lastFetchRef.current = ""; // Reset on error
    } finally {
      setLoading(false);
    }
  }, [userId, dateRange]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: () => {
    lastFetchRef.current = "";
    fetchDetails();
  }};
};
