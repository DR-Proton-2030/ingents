/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';

const DEFAULT_UPLOAD_ENDPOINT = process.env.YT_UPLOAD_ENDPOINT || 'https://your-youtube-upload-service.example.com/upload-video';

export async function uploadYoutubeVideo(payload: {
  user_id: string;
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: 'public' | 'private' | 'unlisted';
  videoURL: string;
  scheduleAt?: string;
  thumbnailDataUrl?: string;
}): Promise<any> {
  const endpoint = process.env.YT_UPLOAD_ENDPOINT || DEFAULT_UPLOAD_ENDPOINT;
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '(no body)');
      throw new Error(`YouTube upload API error ${resp.status}: ${text}`);
    }

    return await resp.json();
  } catch (err) {
    console.error('uploadYoutubeVideo error:', err);
    throw err;
  }
}

export default uploadYoutubeVideo;
