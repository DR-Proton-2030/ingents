import { useState, useEffect, useCallback } from "react";
import { getChannelDetails } from "@/service/youtube/youtube.service";
import { toast } from "react-toastify";

export const useYouTubeDetails = (userId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getChannelDetails(userId);
      if (response.success) {
        setData(response.result);
      } else {
        setError(response.message || "Failed to fetch YouTube details");
        toast.error(response.message || "Failed to fetch YouTube details");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: fetchDetails };
};
