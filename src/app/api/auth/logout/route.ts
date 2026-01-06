import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Call backend API
    const backendUrls = [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`];

    let response: Response | null = null;
    const errors: Array<{ url: string; error: string }> = [];

    for (const url of backendUrls) {
      try {
        console.log(`Attempting to logout at: ${url}`);

        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          console.log(`Successfully logged out at: ${url}`);
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

    // Clear any cookies
    const nextResponse = NextResponse.json(data, { status: response.status });
    nextResponse.cookies.delete("token");

    return nextResponse;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Logout API error:", error);
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