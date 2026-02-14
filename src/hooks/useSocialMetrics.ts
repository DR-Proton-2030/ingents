import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { getSocialMetrics } from "@/utils/api/social/social.api";

export const useSocialMetrics = (userId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string>("");

  const fetchMetrics = useCallback(async () => {
    if (!userId) return;
    
    // Prevent duplicate calls
    if (lastFetchRef.current === userId) return;
    lastFetchRef.current = userId;

    setLoading(true);
    setError(null);
    try {
      const result = await getSocialMetrics(userId);
      if (result && result.success) {
        setData(result.result);
      } else {
        setError(result?.message || "Failed to fetch metrics");
        lastFetchRef.current = ""; // Reset on error
      }
    } catch (err: any) {
      const msg = err.message || "An error occurred";
      setError(msg);
      console.warn("useSocialMetrics error:", msg);
      lastFetchRef.current = ""; // Reset on error
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics: data, loading, error, refetch: async () => {
    lastFetchRef.current = "";
    return fetchMetrics();
  }};
};
