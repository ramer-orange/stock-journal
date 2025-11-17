import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { auth } from '@/auth'

/**
 * Cloudflare Access JWT検証ミドルウェア
 * 
 * 環境変数:
 * - POLICY_AUD: Application Audience (AUD) Tag
 * - TEAM_DOMAIN: https://<your-team-name>.cloudflareaccess.com
 */

/**
 * 認証が必要なパスの定義
 */
const protectedPathPatterns: RegExp[] = [
  /^\/journals(?:\/|$)/,
]

function isProtectedPath(pathname: string): boolean {
  return protectedPathPatterns.some((re) => re.test(pathname))
}

/**
 * JWKSを取得（公式の方法に従い、ミドルウェアの外で一度だけ作成）
 * 注意: Next.jsのミドルウェアでは環境変数がリクエストごとに変わる可能性があるため、
 * 実際の使用時に動的に取得する
 */
let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null
let cachedTeamDomain: string | null = null

function getJWKS(teamDomain: string): ReturnType<typeof createRemoteJWKSet> {
  // チームドメインが変わった場合は再作成
  if (!cachedJWKS || cachedTeamDomain !== teamDomain) {
    const certsUrl = `${teamDomain}/cdn-cgi/access/certs`
    cachedJWKS = createRemoteJWKSet(new URL(certsUrl))
    cachedTeamDomain = teamDomain
  }
  return cachedJWKS
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const requiresAuth = isProtectedPath(pathname)

  // 保護対象パスでない場合はそのまま通過
  if (!requiresAuth) {
    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return response
  }

  // NextAuthのセッションをチェック
  try {
    const session = await auth()
    if (session) {
      // NextAuthのセッションがある場合はそのまま通過
      const response = NextResponse.next()
      response.headers.set('x-pathname', pathname)
      return response
    }
  } catch (error) {
    // セッション取得に失敗した場合はCloudflare Accessのチェックに進む
    console.error('[middleware] Failed to get NextAuth session:', error)
  }

  // 環境変数のチェック（Cloudflare環境とローカル開発環境の両方に対応）
  let policyAud: string | undefined
  let teamDomain: string | undefined
  let deploymentLabel: string | undefined

  try {
    const { env } = getCloudflareContext()
    const cfEnv = env as CloudflareEnv
    policyAud = cfEnv.POLICY_AUD as string | undefined
    teamDomain = cfEnv.TEAM_DOMAIN as string | undefined
    deploymentLabel = cfEnv.ENV as string | undefined
  } catch (error) {
    // ローカル開発環境では getCloudflareContext() が失敗する可能性があるため、
    // process.env から取得を試みる
    policyAud = process.env.POLICY_AUD
    teamDomain = process.env.TEAM_DOMAIN
    deploymentLabel = process.env.ENV
    console.error('[middleware] Failed to get Cloudflare environment variables:', error)
  }

  const isDevEnv =
    deploymentLabel !== undefined
      ? deploymentLabel !== 'production'
      : process.env.NODE_ENV !== 'production'

  if (!policyAud || !teamDomain) {
    const missingVars: string[] = []
    if (!policyAud) missingVars.push('POLICY_AUD')
    if (!teamDomain) missingVars.push('TEAM_DOMAIN')

    if (isDevEnv) {
      return new NextResponse(
        JSON.stringify({
          error: 'Configuration Error',
          message: `Missing required environment variables: ${missingVars.join(', ')}`,
          details: {
            POLICY_AUD: policyAud ? 'set' : 'missing',
            TEAM_DOMAIN: teamDomain ? 'set' : 'missing',
          },
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const signInUrl = new URL('/signIn', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // JWTトークンを取得
  const jwt =
    req.cookies.get('CF_Authorization')?.value ||
    req.headers.get('cf-access-jwt-assertion')

  if (!jwt) {
    // トークンがない場合はCloudflare Accessのログインページにリダイレクト
    const loginUrl = `${teamDomain}/cdn-cgi/access/login`
    return NextResponse.redirect(loginUrl)
  }

  // JWKSを取得
  const JWKS = getJWKS(teamDomain)

  try {
    // JWTを検証
    const { payload } = await jwtVerify(jwt, JWKS, {
      issuer: teamDomain,
      audience: policyAud,
    })

    // 検証成功 - リクエストを続行
    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)

    // JWTペイロードのemailをヘッダーに設定（必要に応じて）
    if (payload.email && typeof payload.email === 'string') {
      response.headers.set('x-cf-access-email', payload.email)
    }

    return response
  } catch {
    // 検証失敗時はCloudflare Accessのログインページにリダイレクト
    const loginUrl = `${teamDomain}/cdn-cgi/access/login`
    return NextResponse.redirect(loginUrl)
  }
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