import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // Validate required fields
    if (!email ) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call backend API
    const backendUrls = [`${process.env.BACKEND_URL}/api/v1/auth/login`];

    let response: Response | null = null;
    const errors: Array<{ url: string; error: string }> = [];

    for (const url of backendUrls) {
      try {
        console.log(`Attempting to call backend at: ${url}`);

        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response) {
          console.log(`Successfully connected to backend at: ${url}`);
          break;
        } else {
          const errorText = await response;
          errors.push({ url, error: `HTTP ${response}: ${errorText}` });
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

    // If backend response includes a token cookie, we need to set it
    const setCookieHeader = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json(data, { status: response.status });

    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Login API error:", error);
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
