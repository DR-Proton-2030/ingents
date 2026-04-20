import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
    try {
        const cookies = req.headers.get("cookie") || "";
        const { searchParams } = new URL(req.url);
        const projectContext = searchParams.get("projectContext");

        const response = await axios.get(
            `${BACKEND_URL}/api/v1/integrations/list`,
            {
                params: projectContext ? { projectContext } : undefined,
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookies,
                },
                withCredentials: true,
            }
        );
        return NextResponse.json(response.data);
    } catch (err: any) {
        console.error("Proxy Integrations List Error:", err.response?.data || err.message);
        return NextResponse.json(
            { message: err.response?.data?.message || "Failed to fetch integrations" },
            { status: err.response?.status || 500 }
        );
    }
}
