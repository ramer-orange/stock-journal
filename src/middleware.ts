import { NextRequest, NextResponse } from 'next/server';
import { isAllowedIp, parseAllowlist } from '@/lib/ip-allowlist';

const rawAllowlist = (process.env.IP_ALLOWLIST ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const compiledAllowlist = parseAllowlist(rawAllowlist);

if (rawAllowlist.length > 0 && compiledAllowlist.length === 0) {
  console.warn('IP_ALLOWLIST has no valid entries; allowing all requests.');
}

export function middleware(request: NextRequest) {
  if (compiledAllowlist.length === 0) {
    return NextResponse.next();
  }

  const clientIp = getClientIp(request);

  if (!isAllowedIp(clientIp, compiledAllowlist)) {
    return new Response('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

function getClientIp(request: NextRequest): string | null {
  const cfHeader = request.headers.get('cf-connecting-ip');
  if (cfHeader) return cfHeader;

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  return null;
}
