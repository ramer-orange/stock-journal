import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 許可するIPアドレスのリスト（環境変数から取得）
function getAllowedIps(): string[] {
  const envIps = process.env.ALLOWED_IPS
  if (!envIps) {
    // デフォルトの許可IPリスト
    return ['127.0.0.1', '::1']
  }

  // カンマ区切りの文字列を配列に変換
  return envIps.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)
}

/**
 * IPアドレスがCIDR範囲内にあるかチェック
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) {
    return ip === cidr
  }

  const [range, bits] = cidr.split('/')
  const mask = -1 << (32 - parseInt(bits))
  const rangeInt = ipToInt(range)
  const ipInt = ipToInt(ip)
  
  return (ipInt & mask) === (rangeInt & mask)
}

/**
 * IPアドレスを整数に変換
 */
function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
}

/**
 * クライアントの実際のIPアドレスを取得
 */
function getClientIp(request: NextRequest): string {
  // Cloudflare Workers環境での実際のIPアドレスを取得
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // 他のプロキシヘッダーもチェック
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp) {
    return xRealIp
  }

  // フォールバック（通常は到達しない）
  return 'unknown'
}

/**
 * IPアドレスが許可リストに含まれているかチェック
 */
function isIpAllowed(ip: string): boolean {
  if (ip === 'unknown') {
    return false
  }

  const allowedIps = getAllowedIps()
  return allowedIps.some(allowedIp => {
    if (allowedIp.includes('/')) {
      return isIpInCidr(ip, allowedIp)
    }
    return ip === allowedIp
  })
}

export function middleware(request: NextRequest) {
  // 開発環境では制限をスキップ
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // IP制限を無効化する場合
  if (process.env.DISABLE_IP_RESTRICTION === 'true') {
    return NextResponse.next()
  }

  const clientIp = getClientIp(request)
  
  // IPアドレスがログに出力されるようにする（デバッグ用）
  console.log(`Access attempt from IP: ${clientIp}`)

  if (!isIpAllowed(clientIp)) {
    console.log(`Access denied for IP: ${clientIp}`)
    
    // アクセス拒否のレスポンスを返す
    return new NextResponse(
      JSON.stringify({
        error: 'Access Denied',
        message: 'Your IP address is not authorized to access this resource.',
        ip: clientIp,
        timestamp: new Date().toISOString()
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  console.log(`Access allowed for IP: ${clientIp}`)
  return NextResponse.next()
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのリクエストにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}