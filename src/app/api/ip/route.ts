import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // クライアントの実際のIPアドレスを取得
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIp = request.headers.get('x-real-ip')
  
  // 利用可能なすべてのIPヘッダーを収集
  const ipHeaders = {
    'cf-connecting-ip': cfConnectingIp,
    'x-forwarded-for': xForwardedFor,
    'x-real-ip': xRealIp,
  }

  // 実際に使用されるIPアドレス
  const clientIp = cfConnectingIp || 
                   (xForwardedFor ? xForwardedFor.split(',')[0].trim() : null) || 
                   xRealIp || 
                   'unknown'

  return NextResponse.json({
    clientIp,
    ipHeaders,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    country: request.headers.get('cf-ipcountry'),
    message: 'This endpoint shows your current IP address as seen by the server'
  })
}
