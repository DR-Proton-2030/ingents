import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/facebook/post`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Facebook Post Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.error || "Facebook post failed",
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}
