/* eslint-disable @typescript-eslint/no-explicit-any */

export type FacebookPostBody = {
  userId: string;
  pageId: string;
  message: string;
  scheduleAt?: string;
};

export type FacebookPostResponse = {
  success: boolean;
  postId?: string;
  message: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function postTextToFacebook(
  payload: FacebookPostBody
): Promise<FacebookPostResponse> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/fa/post-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }

    const data = (await res.json()) as FacebookPostResponse;
    console.log("===>data",data)
    return data;
  } catch (error: unknown) {
    console.error("Facebook postTextToFacebook error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: message || "Failed to post on Facebook",
    };
  }
}

export async function postImageToFacebook(payload: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/fa/post-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Facebook post image error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: message || "Failed to post on Facebook",
    };
  }
}

export async function postVideoToFacebook(payload: any) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/fa/upload-video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Facebook post image error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: message || "Failed to post on Facebook",
    };
  }
}

// Multipart/form-data uploader (for image/file uploads)
export async function postToFacebookFormData(opts: { userId: string; pageId: string; message?: string; imagePath?: string; imageBuffer?: Buffer; filename?: string; contentType?: string; scheduleAt?: string; }) {
  const { userId, pageId, message = '', imagePath, imageBuffer, filename = 'upload.jpg', contentType = 'image/jpeg', scheduleAt } = opts;
  const url = `${BASE_URL.replace(/\/$/, '')}/api/v1/facebook/post`;
  try {
    // Lazy import to avoid opt-in deps when not used
    const FormData = (await import('form-data')).default;
    const fs = await import('fs');
    const axios = (await import('axios')).default;
    const form = new FormData();
    form.append('userId', userId);
    form.append('pageId', pageId);
    form.append('message', message);
    if (scheduleAt) {
      form.append('scheduleAt', scheduleAt);
    }

    if (imageBuffer) {
      form.append('image', imageBuffer, { filename, contentType });
    } else if (imagePath) {
      const stream = fs.createReadStream(imagePath);
      form.append('image', stream, { filename, contentType });
    }

    // Get headers including boundary
    const headers = form.getHeaders();
    // Determine content length (some servers/busboy need it)
    const length: number = await new Promise((resolve, reject) => {
      form.getLength((err: any, len: number) => {
        if (err) return reject(err);
        resolve(len);
      });
    });
    (headers as any)['Content-Length'] = length;

    const resp = await axios.post(url, form as any, {
      headers,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30_000,
    });

    if (resp.status < 200 || resp.status >= 300) {
      throw new Error(`HTTP ${resp.status}: ${JSON.stringify(resp.data)}`);
    }

    return resp.data;
  } catch (err: unknown) {
    console.error('postToFacebookFormData error', err);
    return { success: false, message: err instanceof Error ? err.message : String(err) };
  }
}
