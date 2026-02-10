import { useState, useEffect, useCallback, useRef } from "react";
import { getFacebookPageDetails } from "@/service/facebook/facebook.service";
import { toast } from "react-toastify";

export const useFacebookDetails = (userId: string | undefined, pageId: string | undefined, dateRange: string = "LAST_28_DAYS") => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string>("");

  const fetchDetails = useCallback(async () => {
    if (!userId || !pageId) return;
    
    // Prevent duplicate calls
    const fetchKey = `${userId}-${pageId}-${dateRange}`;
    if (lastFetchRef.current === fetchKey) return;
    lastFetchRef.current = fetchKey;

    setLoading(true);
    setError(null);
    try {
      const response = await getFacebookPageDetails(userId, pageId, dateRange);
      if (response && response.success) {
        setData(response.result);
      } else {
        setError(response?.message || "Failed to fetch Facebook details");
        toast.error(response?.message || "Failed to fetch Facebook details");
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
  }, [userId, pageId, dateRange]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: () => {
    lastFetchRef.current = "";
    fetchDetails();
  }};
};
