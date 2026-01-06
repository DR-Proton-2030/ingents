import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const chatId = req.nextUrl.pathname.split("/")[3]; 
    const userToken = (await cookies()).get("token")?.value;

    const backendResp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/${chatId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const text = await backendResp.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: backendResp.status });
    } catch {
      return new NextResponse(text, { status: backendResp.status });
    }
  } catch (err) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
