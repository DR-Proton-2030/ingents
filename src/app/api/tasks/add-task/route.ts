/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function POST(req: Request) {
  try {
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";
    const contentType = req.headers.get("content-type") || "";

    let response;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData - forward as-is
      const formData = await req.formData();
      
      // Convert FormData to a format axios can handle
      const axiosFormData = new FormData();
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // Convert File to Blob for axios
          const buffer = await value.arrayBuffer();
          const blob = new Blob([buffer], { type: value.type });
          axiosFormData.append(key, blob, value.name);
        } else {
          axiosFormData.append(key, value);
        }
      }

      response = await axios.post(
        `${BACKEND_URL}/api/v1/tasks/create-task`,
        axiosFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Cookie": cookies,
          },
          withCredentials: true,
        }
      );
    } else {
      // Handle JSON
      const body = await req.json();
      
      response = await axios.post(
        `${BACKEND_URL}/api/v1/tasks/create-task`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            "Cookie": cookies,
          },
          withCredentials: true,
        }
      );
    }

    console.log("response from create task:", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to create task" },
      { status: err.response?.status || 500 }
    );
  }
}
