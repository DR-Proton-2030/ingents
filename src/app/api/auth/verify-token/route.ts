import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies or headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Call backend API
    const backendUrls = [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-token`];

    let response: Response | null = null;
    const errors: Array<{ url: string; error: string }> = [];

    for (const url of backendUrls) {
      try {
        console.log(`Attempting to verify token at: ${url}`);

        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          console.log(`Successfully verified token at: ${url}`);
          break;
        } else {
          const errorText = await response.text();
          errors.push({ url, error: `HTTP ${response.status}: ${errorText}` });
          response = null;
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Connection failed";
        console.error(`Failed to connect to ${url}:`, error);
        errors.push({
          url,
          error: errorMessage,
        });
        response = null;
      }
    }

    if (!response) {
      console.error("All backend attempts failed:", errors);
      return NextResponse.json(
        {
          message: "Unable to connect to backend service",
          details: "Please ensure the backend server is running",
          errors,
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Verify token API error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}