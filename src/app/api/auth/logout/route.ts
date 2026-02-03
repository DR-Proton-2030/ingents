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
          console.warn(`Logout backend at ${url} returned status ${response.status}`);
          break;
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

    let data = { message: "Logged out" };
    if (response) {
      try {
        data = await response.json();
      } catch (e) {
        // Fallback if not JSON
      }
    }

    // Clear any cookies
    const nextResponse = NextResponse.json(data, { 
      status: response ? response.status : 200 
    });
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