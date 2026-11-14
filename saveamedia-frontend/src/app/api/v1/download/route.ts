import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'saveamedia_reel.mp4';

  if (!mediaUrl) {
    return new NextResponse('Missing "url" query parameter', { status: 400 });
  }

  try {
    const reqHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    };

    if (mediaUrl.includes('instagram.com') || mediaUrl.includes('cdninstagram.com')) {
      reqHeaders['Referer'] = 'https://www.instagram.com/';
    }

    const upstreamRes = await fetch(mediaUrl, {
      headers: reqHeaders,
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      // Fallback redirect directly to media CDN URL
      return NextResponse.redirect(mediaUrl, 302);
    }

    const rawType = upstreamRes.headers.get('content-type') || '';
    const isImage = rawType.includes('image') || filename.endsWith('.jpg') || filename.endsWith('.jpeg');
    const contentType = isImage ? (rawType || 'image/jpeg') : 'video/mp4';
    const contentLength = upstreamRes.headers.get('content-length');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Cache-Control': 'public, max-age=3600',
      'Accept-Ranges': 'bytes',
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.redirect(mediaUrl, 302);
  }
}
