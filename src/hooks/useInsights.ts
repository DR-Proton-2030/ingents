import { useState, useEffect, useCallback, useRef } from "react";
import {
  getInsightsSummary,
  getContentMetricsHistory,
  getUserContentWithMetrics,
  getAccountInsightsHistory,
  triggerInsightsSync,
} from "../utils/api/insights/insights.api";

/**
 * Hook to fetch aggregated insights summary across all platforms
 */
export const useInsightsSummary = (userId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef("");

  const fetch = useCallback(async () => {
    if (!userId || lastFetchRef.current === userId) return;
    lastFetchRef.current = userId;
    setLoading(true);
    setError(null);
    try {
      const res = await getInsightsSummary(userId);
      setData(res.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    lastFetchRef.current = "";
    fetch();
  }, [fetch]);

  return { summary: data, loading, error, refetch };
};

/**
 * Hook to fetch content metrics history for a specific post
 */
export const useContentMetricsHistory = (
  postId: string | undefined,
  days?: number
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getContentMetricsHistory(postId, days);
      setData(res.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId, days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

/**
 * Hook to fetch all published content with metrics for a user
 */
export const useUserContentWithMetrics = (
  userId: string | undefined,
  options?: { platform?: string; limit?: number; offset?: number }
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getUserContentWithMetrics(userId, options);
      setData(res.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, options?.platform, options?.limit, options?.offset]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

/**
 * Hook to fetch account-level insights history for a platform
 */
export const useAccountInsightsHistory = (
  platform: string | undefined,
  userId: string | undefined,
  days?: number
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!platform || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAccountInsightsHistory(platform, userId, days);
      setData(res.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [platform, userId, days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

/**
 * Hook to trigger on-demand insights sync
 */
export const useTriggerSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async (userId: string) => {
    setSyncing(true);
    setError(null);
    try {
      const res = await triggerInsightsSync(userId);
      return res;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setSyncing(false);
    }
  }, []);

  return { sync, syncing, error };
};
