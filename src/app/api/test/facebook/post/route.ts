import { NextResponse } from 'next/server';
import { postToFacebookFormData } from '@/service/postGeneration/postGeneration.service';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const userId = (form.get('userId') as string) || '';
    const pageId = (form.get('pageId') as string) || '';
    const message = (form.get('message') as string) || '';
    const image = form.get('image') as any || null;

    const opts: any = { userId, pageId, message };
    if (image && typeof image === 'object' && typeof image.arrayBuffer === 'function') {
      const buf = Buffer.from(await image.arrayBuffer());
      opts.imageBuffer = buf;
      opts.filename = image.name || 'upload.jpg';
      opts.contentType = image.type || 'image/jpeg';
    }

    const resp = await postToFacebookFormData(opts);
    return NextResponse.json(resp);
  } catch (err: any) {
    console.error('test facebook post route error', err);
    return NextResponse.json({ success: false, message: err?.message || String(err) }, { status: 500 });
  }
}
