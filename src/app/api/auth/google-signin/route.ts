import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ message: "Google token is required" }, { status: 400 });
    }

    // Verify Google token
    const googleRes = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + token);
    if (!googleRes.ok) {
      return NextResponse.json({ message: "Invalid Google token" }, { status: 401 });
    }
    const googleUser = await googleRes.json();
    console.log("Google user verified:", googleUser.email);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
    const endpoint = backendUrl + "/api/v1/auth/google-signup";
    console.log("Calling backend:", endpoint);

    let backendRes: Response;
    try {
      backendRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleUser.email,
          full_name: googleUser.name,
          profile_picture: googleUser.picture,
          google_id: googleUser.sub,
        }),
      });
    } catch (fetchErr: any) {
      console.error("Backend unreachable:", fetchErr.message);
      return NextResponse.json({ message: "Backend unreachable: " + fetchErr.message }, { status: 502 });
    }

    const text = await backendRes.text();
    console.log("Backend status:", backendRes.status, "response:", text);

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ message: "Backend returned invalid JSON: " + text.slice(0, 200) }, { status: 502 });
    }

    const response = NextResponse.json(data, { status: backendRes.status });
    const cookie = backendRes.headers.get("set-cookie");
    if (cookie) response.headers.set("set-cookie", cookie);
    return response;

  } catch (error: any) {
    console.error("Google signin route error:", error.message);
    return NextResponse.json({ message: "Route error: " + error.message }, { status: 500 });
  }
}
