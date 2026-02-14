import API from "../api";

/**
 * Synchronizes YouTube data for a specific user.
 */
export const syncYoutube = async (userId: string): Promise<any> => {
  try {
    const response = await API.get("/social/sync/youtube", {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ YouTube Sync failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Synchronizes Facebook data for a specific user and page.
 */
export const syncFacebook = async (userId: string, pageId: string): Promise<any> => {
  try {
    const response = await API.get("/social/sync/facebook", {
      params: { user_id: userId, page_id: pageId },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Facebook Sync failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Centralized function to trigger synchronization based on platform type.
 * This is used by the dashboard button.
 */

/**
 * Fetches social media metrics for a user.
 */
export const getSocialMetrics = async (userId: string): Promise<any> => {
  try {
    const response = await API.get("/social/metrics", {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch social metrics:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches YouTube dashboard data for a user.
 */
export const getYoutubeDashboardData = async (userId: string): Promise<any> => {
  try {
    const response = await API.get("/social/youtube/dashboard-data", {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch YouTube dashboard data:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches Facebook dashboard data for a user.
 */
export const getFacebookDashboardData = async (userId: string): Promise<any> => {
  try {
    const response = await API.get("/social/facebook/dashboard-data", {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch Facebook dashboard data:", error.response?.data || error.message);
    throw error;
  }
};


