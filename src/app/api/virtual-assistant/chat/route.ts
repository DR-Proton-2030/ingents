import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const cookies = req.headers.get("cookie") || "";

        const response = await axios.post(
            `${BACKEND_URL}/api/v1/virtual-assistant/chat`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookies,
                },
                withCredentials: true,
            }
        );
        return NextResponse.json(response.data);
    } catch (err: any) {
        console.error("Proxy Virtual Assistant Error:", err.response?.data || err.message);
        return NextResponse.json(
            { message: err.response?.data?.message || "Failed to process AI request" },
            { status: err.response?.status || 500 }
        );
    }
}
