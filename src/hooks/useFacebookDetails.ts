import { useState, useEffect, useCallback } from "react";
import { getFacebookPageDetails } from "@/service/facebook/facebook.service";
import { toast } from "react-toastify";

export const useFacebookDetails = (userId: string | undefined, pageId: string | undefined, dateRange: string = "LAST_28_DAYS") => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!userId || !pageId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getFacebookPageDetails(userId, pageId, dateRange);
      if (response && response.success) {
        setData(response.result);
      } else {
        setError(response?.message || "Failed to fetch Facebook details");
        toast.error(response?.message || "Failed to fetch Facebook details");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userId, pageId, dateRange]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: fetchDetails };
};
