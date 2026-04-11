import API from "../api";

/**
 * Fetches aggregated insights summary across all platforms for a user.
 */
export const getInsightsSummary = async (userId: string): Promise<any> => {
  try {
    const response = await API.get("/insights/summary", {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch insights summary:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches content metrics history (engagement over time) for a specific post.
 */
export const getContentMetricsHistory = async (
  postId: string,
  days?: number
): Promise<any> => {
  try {
    const response = await API.get(`/insights/content/${postId}/history`, {
      params: days ? { days } : {},
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch content metrics:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches all published content with latest metrics for a user.
 */
export const getUserContentWithMetrics = async (
  userId: string,
  options?: { platform?: string; limit?: number; offset?: number }
): Promise<any> => {
  try {
    const response = await API.get(`/insights/content/user/${userId}`, {
      params: options,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch user content:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches account-level insights history for a specific platform.
 */
export const getAccountInsightsHistory = async (
  platform: string,
  userId: string,
  days?: number
): Promise<any> => {
  try {
    const response = await API.get(`/insights/account/${platform}/history`, {
      params: { userId, ...(days ? { days } : {}) },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch account insights:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Triggers an on-demand insights sync for a user.
 */
export const triggerInsightsSync = async (userId: string): Promise<any> => {
  try {
    const response = await API.post("/insights/sync", { userId });
    return response.data;
  } catch (error: any) {
    console.error("Failed to trigger sync:", error.response?.data || error.message);
    throw error;
  }
};
