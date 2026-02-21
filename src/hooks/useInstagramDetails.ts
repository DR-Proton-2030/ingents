import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getInstagramDashboardData } from "@/utils/api/social/social.api";

export const useInstagramDetails = (userId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<string>("");

  const fetchDetails = useCallback(async () => {
    if (!userId) return;

    // Prevent duplicate calls
    const fetchKey = `${userId}`;
    if (lastFetchRef.current === fetchKey) return;
    lastFetchRef.current = fetchKey;

    setLoading(true);
    setError(null);
    try {
      const response = await getInstagramDashboardData(userId);
      const payload = response?.result || response?.data || response;

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to fetch Instagram details",
        );
      }

      // Backend response format: { success: true, result: { ... } }
      setData(payload);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || "An error occurred";
      setError(msg);
      toast.error(msg);
      lastFetchRef.current = "";
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      lastFetchRef.current = "";
      fetchDetails();
    },
  };
};
