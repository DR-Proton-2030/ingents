import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

/**
 * Next.js API Route for YouTube Uploads.
 * Securely proxies the request from the frontend to the backend service.
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let dataToForward: any;
    let axiosConfig: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const backendFormData = new FormData();
      
      // Copy all fields from incoming FormData to new FormData
      for (const [key, value] of formData.entries()) {
        backendFormData.append(key, value);
      }
      
      dataToForward = backendFormData;
      // When sending FormData, Axios will set the correct content-type with boundary
    } else {
      dataToForward = await req.json();
      axiosConfig.headers = { "Content-Type": "application/json" };
    }

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/youtube/upload-video`,
      dataToForward,
      axiosConfig
    );

    // Return Backend Response to Frontend
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("YouTube Proxy API Error:", errorData || error.message);

    return NextResponse.json(
      {
        success: false,
        message: errorData?.message || "YouTube upload failed at backend",
        error: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
