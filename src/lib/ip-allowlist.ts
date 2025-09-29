const IPV4_BITS = 32;
const IPV6_BITS = 128;
const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const BIGINT_EIGHT = BigInt(8);
const BIGINT_SIXTEEN = BigInt(16);
const IPV4_SEGMENT_MASK = BigInt(0xffff);

interface IPv4Rule {
  kind: 'v4';
  base: bigint;
  mask: bigint;
}

interface IPv6Rule {
  kind: 'v6';
  base: bigint;
  mask: bigint;
}

export type CompiledRule = IPv4Rule | IPv6Rule;

export function parseAllowlist(rawEntries: readonly string[]): CompiledRule[] {
  const rules: CompiledRule[] = [];
  for (const entry of rawEntries) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    const [ipPart, prefixPart] = splitEntry(trimmed);
    const parsedIp = parseIp(ipPart);
    if (!parsedIp) continue;

    if (parsedIp.kind === 'v4') {
      const prefixLength = parsePrefix(prefixPart, IPV4_BITS);
      if (prefixLength === null) continue;
      const mask = prefixToMask(prefixLength, IPV4_BITS);
      rules.push({ kind: 'v4', base: parsedIp.value, mask });
    } else {
      const prefixLength = parsePrefix(prefixPart, IPV6_BITS);
      if (prefixLength === null) continue;
      const mask = prefixToMask(prefixLength, IPV6_BITS);
      rules.push({ kind: 'v6', base: parsedIp.value, mask });
    }
  }
  return rules;
}

export function isAllowedIp(input: string | null | undefined, rules: readonly CompiledRule[]): boolean {
  if (!input) return false;
  const parsed = parseIp(input.trim());
  if (!parsed) return false;
  for (const rule of rules) {
    if (rule.kind !== parsed.kind) continue;
    if ((parsed.value & rule.mask) === (rule.base & rule.mask)) {
      return true;
    }
  }
  return false;
}

function splitEntry(entry: string): [string, string | undefined] {
  const slashIndex = entry.indexOf('/');
  if (slashIndex === -1) {
    return [entry, undefined];
  }
  return [entry.slice(0, slashIndex), entry.slice(slashIndex + 1)];
}

type ParsedIp =
  | { kind: 'v4'; value: bigint }
  | { kind: 'v6'; value: bigint };

function parseIp(ip: string): ParsedIp | null {
  const v4 = parseIPv4(ip);
  if (v4 !== null) {
    return { kind: 'v4', value: v4 };
  }
  const v6 = parseIPv6(ip);
  if (v6 !== null) {
    return { kind: 'v6', value: v6 };
  }
  return null;
}

function parseIPv4(ip: string): bigint | null {
  const segments = ip.split('.');
  if (segments.length !== 4) return null;
  let value = BIGINT_ZERO;
  for (const segment of segments) {
    if (!segment) return null;
    if (!/^\d+$/.test(segment)) return null;
    const octet = Number(segment);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    value = (value << BIGINT_EIGHT) + BigInt(octet);
  }
  return value;
}

function parseIPv6(ip: string): bigint | null {
  if (!ip.includes(':')) return null;
  const hasDoubleColon = ip.includes('::');
  if (hasDoubleColon && ip.indexOf('::') !== ip.lastIndexOf('::')) {
    return null;
  }
  const [headPart, tailPart] = hasDoubleColon ? ip.split('::', 2) : [ip, undefined];
  const headSegments = headPart ? headPart.split(':').filter(Boolean) : [];
  const tailSegments = tailPart ? tailPart.split(':').filter(Boolean) : [];

  const head = expandIPv6Segments(headSegments);
  const tail = expandIPv6Segments(tailSegments);
  if (!head || !tail) return null;

  const missing = hasDoubleColon ? 8 - (head.length + tail.length) : 0;
  if (missing < 0) return null;
  const filler = new Array(missing).fill(0);
  const fullSegments = hasDoubleColon ? [...head, ...filler, ...tail] : head;

  if (!hasDoubleColon && fullSegments.length !== 8) {
    return null;
  }
  if (fullSegments.length !== 8) {
    return null;
  }

  let value = BIGINT_ZERO;
  for (const segment of fullSegments) {
    value = (value << BIGINT_SIXTEEN) + BigInt(segment);
  }
  return value;
}

function expandIPv6Segments(segments: string[]): number[] | null {
  const result: number[] = [];
  for (const segment of segments) {
    if (segment.includes('.')) {
      const ipv4 = parseIPv4(segment);
      if (ipv4 === null) return null;
      const upper = Number((ipv4 >> BigInt(16)) & IPV4_SEGMENT_MASK);
      const lower = Number(ipv4 & IPV4_SEGMENT_MASK);
      result.push(upper, lower);
      continue;
    }
    if (!segment) {
      result.push(0);
      continue;
    }
    if (!/^[0-9a-fA-F]{1,4}$/.test(segment)) {
      return null;
    }
    result.push(parseInt(segment, 16));
  }
  return result;
}

function parsePrefix(prefix: string | undefined, maxBits: number): number | null {
  if (prefix === undefined) {
    return maxBits;
  }
  if (!/^\d+$/.test(prefix)) {
    return null;
  }
  const value = Number(prefix);
  if (!Number.isInteger(value) || value < 0 || value > maxBits) {
    return null;
  }
  return value;
}

function prefixToMask(prefixLength: number, totalBits: number): bigint {
  if (prefixLength === 0) {
    return BIGINT_ZERO;
  }
  const prefix = BigInt(prefixLength);
  const bits = BigInt(totalBits);
  const ones = (BIGINT_ONE << prefix) - BIGINT_ONE;
  return ones << (bits - prefix);
}
