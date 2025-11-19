import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { NextRequest } from 'next/server';

function getR2Context(request: NextRequest) {
  const { env } = getCloudflareContext();
  const url = new URL(request.url);
  const key = url.pathname.slice(1) + '/' + crypto.randomUUID();
  return { env, key };
}

export async function PUT(request: NextRequest) {
  try {
    const { env, key } = getR2Context(request);
    const contentType = request.headers.get('content-type');

    // アップロードされたファイルタイプが画像かチェック
    if (!contentType || !contentType.startsWith('image/')) {
      return new Response('Only image uploads are allowed', { status: 400 });
    }

    // リクエスト本体をバイナリデータとして読み込んで、R2にアップロード(サイズ数がわかるため)
    const body = await request.arrayBuffer();

    const object = await env.R2_DEV.put(key, body, {
      httpMetadata: {
        contentType,
      },
    });
    console.log('object', {key: object?.key});
    return new Response(
      JSON.stringify({r2Key: object?.key}),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[fileUpload] PUT error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

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

// ファイル削除処理
export async function DELETE(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();
    const key = request.nextUrl.searchParams.get('key');

    if (!key) {
      return new Response('Missing key parameter', { status: 400 });
    }

    await env.R2_DEV.delete(key);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('[fileUpload] DELETE error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
