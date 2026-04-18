/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

async function proxyRequest(req: Request, method: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    // Extract the path from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.replace("/api/subscription/", "");
    const backendUrl = `${BACKEND_URL}/api/v1/subscription/${pathSegments}${url.search}`;

    const config: any = {
      method,
      url: backendUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Add body for POST/PATCH/PUT
    if (["POST", "PATCH", "PUT"].includes(method)) {
      try {
        const bodyText = await req.text();
        if (bodyText) {
          config.data = JSON.parse(bodyText);
        }
      } catch (e) {
        // No body or invalid JSON
      }
    }

    const response = await axios(config);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error(`Subscription proxy error [${method}]:`, err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || err.message || "Request failed" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function GET(req: Request) {
  return proxyRequest(req, "GET");
}

export async function POST(req: Request) {
  return proxyRequest(req, "POST");
}

export async function PATCH(req: Request) {
  return proxyRequest(req, "PATCH");
}
