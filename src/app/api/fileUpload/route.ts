import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { NextRequest } from 'next/server';

// クエリパラメータでkeyを指定してファイルを取得
export async function GET(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    const key = request.nextUrl.searchParams.get('key');

    if (!key) {
      return new Response('Missing key parameter', { status: 400 });
    }

    const object = await env.R2_DEV.get(key);

    if (object === null) {
      return new Response('Object Not Found', { status: 404 });
    }

    const headers: Record<string, string> = {};
    const metadata = object.httpMetadata ?? {};
    for (const [name, value] of Object.entries(metadata)) {
      if (typeof value === 'undefined') continue;
      headers[name] = Array.isArray(value) ? value.join(',') : String(value);
    }
    if (object.httpEtag) {
      headers.etag = object.httpEtag;
    }

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[fileUpload] GET error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
