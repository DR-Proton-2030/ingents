import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useSocialMetrics = (userId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/social/metrics?userId=${userId}`);
      if (response.data && response.data.success) {
        setData(response.data.result);
      } else {
        setError(response.data?.message || "Failed to fetch metrics");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      // Fail silently or toast
      console.warn("useSocialMetrics error:", msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics: data, loading, error, refetch: fetchMetrics };
};
