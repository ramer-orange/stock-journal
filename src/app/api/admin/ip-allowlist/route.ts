import { NextRequest, NextResponse } from 'next/server'
import { isValidIpAddress } from '@/lib/ip-allowlist'

function getAllowedIpsFromEnv(): string[] {
  const envIps = process.env.ALLOWED_IPS
  if (!envIps) {
    return ['127.0.0.1', '::1']
  }
  return envIps.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)
}

export async function GET() {
  try {
    const allowedIps = getAllowedIpsFromEnv()
    
    return NextResponse.json({
      allowedIps,
      count: allowedIps.length,
      timestamp: new Date().toISOString()
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to retrieve IP allowlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { ip?: string; description?: string }
    const { ip, description } = body
    
    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      )
    }

    if (!isValidIpAddress(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      )
    }

    // Note: 実際の本番環境では、環境変数やデータベースに保存する必要があります
    // このエンドポイントは現在のリストを表示する目的で作成されています
    
    return NextResponse.json({
      message: 'IP address validation successful',
      ip,
      description,
      note: 'To actually add this IP, please update the ALLOWED_IPS environment variable in your Cloudflare Workers settings'
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
