/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim().length < 1) {
    return NextResponse.json({ data: { users: [], tasks: [], projects: [], campaigns: [] } });
  }

  const cookies = req.headers.get("cookie") || "";
  const headers = {
    "Content-Type": "application/json",
    Cookie: cookies,
  };

  // Run all searches in parallel
  const [usersRes, tasksRes, projectsRes, campaignsRes] = await Promise.allSettled([
    axios.get(`${BACKEND_URL}/api/v1/user/search-users`, {
      params: { query },
      headers,
      withCredentials: true,
    }),
    axios.get(`${BACKEND_URL}/api/v1/tasks/get-tasks`, {
      params: { search: query },
      headers,
      withCredentials: true,
    }),
    axios.get(`${BACKEND_URL}/api/v1/projects/get-projects`, {
      params: { search: query },
      headers,
      withCredentials: true,
    }),
    axios.get(`${BACKEND_URL}/api/v1/campaign`, {
      params: { search: query },
      headers,
      withCredentials: true,
    }),
  ]);

  const extract = (result: PromiseSettledResult<any>, path?: string) => {
    if (result.status === "fulfilled") {
      const data = result.value.data;
      if (path) return data?.[path] ?? data?.data ?? [];
      return data?.data ?? data ?? [];
    }
    return [];
  };

  return NextResponse.json({
    data: {
      users: extract(usersRes, "data"),
      tasks: extract(tasksRes, "tasks") || extract(tasksRes),
      projects: extract(projectsRes, "projects") || extract(projectsRes),
      campaigns: extract(campaignsRes, "campaigns") || extract(campaignsRes),
    },
  });
}
