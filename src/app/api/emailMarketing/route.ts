import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("[API LOG] GET /api/email-marketing called");

  try {
    const userToken = (await cookies()).get("token")?.value;

    console.log("fetch chats called");
    console.log(userToken);

    const url = req.url.includes("/messages")
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/${req.nextUrl.searchParams.get(
          "chatId"
        )}/messages`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat`;

    console.log("[API LOG] Proxying GET request to:", url);

    const backendResp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const respBody = await backendResp.text();

    try {
      const json = JSON.parse(respBody);
      return NextResponse.json(json, { status: backendResp.status });
    } catch {
      return new NextResponse(respBody, {
        status: backendResp.status,
        headers: {
          "content-type":
            backendResp.headers.get("content-type") || "text/plain",
        },
      });
    }
  } catch (err) {
    console.error("[API LOG] GET proxy error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   console.log("[API LOG] POST /api/email-marketing called");

//   try {
//     const userToken = (await cookies()).get("token")?.value;

//     const body = await req.json();

//     // Determine which backend API to call
//     let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat`;
//     if (body.chatId && body.content) {
//       url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/send-message`;
//     }

//     console.log("[API LOG] Proxying POST request to:", url);

//     const backendResp = await fetch(url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${userToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const respBody = await backendResp.text();
//     try {
//       const json = JSON.parse(respBody);
//       return NextResponse.json(json, { status: backendResp.status });
//     } catch {
//       return new NextResponse(respBody, {
//         status: backendResp.status,
//         headers: {
//           "content-type":
//             backendResp.headers.get("content-type") || "text/plain",
//         },
//       });
//     }
//   } catch (err) {
//     console.error("[API LOG] POST proxy error:", err);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



export async function POST(req: NextRequest) {
  console.log("[API LOG] POST /api/email-marketing called");

  try {
    const userToken = (await cookies()).get("token")?.value;

    let isMultipart = false;
    let body: any = null;

    // Detect if request is multipart/form-data or JSON
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
      body.files = form.getAll("files"); // ensure files array is retained
    } else {
      body = await req.json();
    }

    // Keep your original logic exactly the same
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat`;
    if (body.chatId && body.content) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/chat/send-message`;
    }

    console.log("[API LOG] Proxying POST request to:", url);
    console.log("[API LOG] Multipart:", isMultipart);

    let backendResp;

    if (isMultipart) {
      // If multipart, build FormData to forward to backend
      const backendForm = new FormData();
      backendForm.append("chatId", body.chatId);
      backendForm.append("sender", body.sender);
      backendForm.append("content", body.content);

      if (body.files && body.files.length > 0) {
        (body.files as File[]).forEach((file) => {
          backendForm.append("files", file);
        });
      }

      backendResp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          // ❌ don't manually set Content-Type, let fetch handle boundary
        },
        body: backendForm,
      });
    } else {
      // If JSON, keep your original JSON request flow
      backendResp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    }

    const respBody = await backendResp.text();
    try {
      const json = JSON.parse(respBody);
      return NextResponse.json(json, { status: backendResp.status });
    } catch {
      return new NextResponse(respBody, {
        status: backendResp.status,
        headers: {
          "content-type":
            backendResp.headers.get("content-type") || "text/plain",
        },
      });
    }
  } catch (err) {
    console.error("[API LOG] POST proxy error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
