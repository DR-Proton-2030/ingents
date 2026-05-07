/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract user details
    const userDetailsString = formData.get("user_details") as string;
    const companyDetailsString = formData.get("company_details") as string | null;

    // Extract files
    const userAvatar = formData.get("user_avatar") as File | null;
    const companyLogo = formData.get("company_logo") as File | null;

    if (!userDetailsString) {
      return NextResponse.json(
        { message: "Missing required user data" },
        { status: 400 }
      );
    }

    let userDetails, companyDetails;
    try {
      userDetails = JSON.parse(userDetailsString);
      companyDetails = companyDetailsString ? JSON.parse(companyDetailsString) : null;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!userDetails.full_name || !userDetails.email || !userDetails.password) {
      return NextResponse.json(
        { message: "Missing required user fields" },
        { status: 400 }
      );
    }

    // Create form data for backend
    const backendFormData = new FormData();

    // Add user and company details
    backendFormData.append("user_details", JSON.stringify(userDetails));
    if (companyDetails) {
      backendFormData.append("company_details", JSON.stringify(companyDetails));
    }

    // Add files if they exist
    if (userAvatar) {
      backendFormData.append("user_avatar", userAvatar);
    }
    if (companyLogo) {
      backendFormData.append("company_logo", companyLogo);
    }

    // Call backend API
    console.log("BACKEND_URL from env:", process.env.NEXT_PUBLIC_BACKEND_URL);
    const backendUrls = [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signup`];
    let response: Response | null = null;
    const errors: Array<{ url: string; error: string }> = [];

    for (const url of backendUrls) {
      try {
        console.log(`Attempting to call backend at: ${url}`);

        response = await fetch(url, {
          method: "POST",
          body: backendFormData,
        });

        if (response) {
          console.log(`Successfully connected to backend at: ${url}`);
          break;
        } else {
          const errorText = response;
          errors.push({ url, error: `HTTP ${response}: ${errorText}` });
          response = null;
        }
      } catch (error: any) {
        console.error(`Failed to connect to ${url}:`, error);
        errors.push({
          url,
          error: error.message || "Connection failed",
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
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
