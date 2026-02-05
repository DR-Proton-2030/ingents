import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SchedulePostData {
  user_id: string;
  platform: "facebook" | "instagram" | "youtube" | "x";
  content: string;
  media_urls?: string[];
  media_type?: "image" | "video" | "text";
  hashtags?: string[];
  scheduled_at: string;
  page_id?: string;
  channel_id?: string;
  platform_specific_data?: Record<string, any>;
}

export interface ScheduledPost {
  _id: string;
  user_id: string;
  platform: "facebook" | "instagram" | "youtube" | "x";
  content: string;
  media_urls?: string[];
  media_type?: "image" | "video" | "text";
  hashtags?: string[];
  scheduled_at: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  job_id?: string;
  page_id?: string;
  channel_id?: string;
  platform_specific_data?: Record<string, any>;
  error_message?: string;
  retry_count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostedContent {
  _id: string;
  user_id: string;
  scheduled_post_id?: string;
  platform: "facebook" | "instagram" | "youtube" | "x";
  content: string;
  media_urls?: string[];
  media_type?: "image" | "video" | "text";
  hashtags?: string[];
  posted_at: string;
  platform_post_id?: string;
  platform_response?: Record<string, any>;
  page_id?: string;
  channel_id?: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  is_scheduled: boolean;
  status: "published" | "failed";
  error_message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulerApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

/**
 * Schedule a new social media post
 */
export const schedulePost = async (
  postData: SchedulePostData
): Promise<SchedulerApiResponse<ScheduledPost>> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/scheduler/schedule`,
      postData
    );
    return response.data;
  } catch (error: any) {
    console.error("Schedule Post Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Schedule multiple posts at once
 */
export const scheduleBulkPosts = async (
  posts: SchedulePostData[]
): Promise<SchedulerApiResponse<{ success: ScheduledPost[]; failed: any[] }>> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/scheduler/schedule/bulk`,
      { posts }
    );
    return response.data;
  } catch (error: any) {
    console.error("Bulk Schedule Posts Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get all scheduled posts for a user
 */
export const getScheduledPosts = async (
  userId: string,
  options?: { status?: string; platform?: string }
): Promise<SchedulerApiResponse<ScheduledPost[]>> => {
  try {
    const params = new URLSearchParams();
    if (options?.status) params.append("status", options.status);
    if (options?.platform) params.append("platform", options.platform);

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/scheduler/scheduled/${userId}?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get Scheduled Posts Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a single scheduled post by ID
 */
export const getScheduledPostById = async (
  postId: string
): Promise<SchedulerApiResponse<ScheduledPost>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/scheduler/scheduled/post/${postId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get Scheduled Post Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update a scheduled post
 */
export const updateScheduledPost = async (
  postId: string,
  updateData: Partial<SchedulePostData>
): Promise<SchedulerApiResponse<ScheduledPost>> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/scheduler/scheduled/${postId}`,
      updateData
    );
    return response.data;
  } catch (error: any) {
    console.error("Update Scheduled Post Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Reschedule a post to a new time
 */
export const reschedulePost = async (
  postId: string,
  newScheduledAt: string
): Promise<SchedulerApiResponse<ScheduledPost>> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/scheduler/scheduled/${postId}/reschedule`,
      { scheduled_at: newScheduledAt }
    );
    return response.data;
  } catch (error: any) {
    console.error("Reschedule Post Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cancel a scheduled post
 */
export const cancelScheduledPost = async (
  postId: string
): Promise<SchedulerApiResponse<null>> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/scheduler/scheduled/${postId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Cancel Scheduled Post Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get posted content history for a user
 */
export const getPostedContent = async (
  userId: string,
  options?: { platform?: string; limit?: number }
): Promise<SchedulerApiResponse<PostedContent[]>> => {
  try {
    const params = new URLSearchParams();
    if (options?.platform) params.append("platform", options.platform);
    if (options?.limit) params.append("limit", options.limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/api/v1/scheduler/posted/${userId}?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get Posted Content Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a single posted content by ID
 */
export const getPostedContentById = async (
  postId: string
): Promise<SchedulerApiResponse<PostedContent>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/scheduler/posted/post/${postId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get Posted Content Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get queue status (admin)
 */
export const getQueueStatus = async (): Promise<
  SchedulerApiResponse<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }>
> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/scheduler/queue/status`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get Queue Status Error:", error.response?.data || error.message);
    throw error;
  }
};
