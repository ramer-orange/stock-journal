/**
 * IP許可リスト管理ユーティリティ
 */

export interface IpRule {
  ip: string
  description?: string
  addedAt?: string
}

/**
 * デフォルトの許可IPリスト
 * 環境変数で上書き可能
 */
export const DEFAULT_ALLOWED_IPS: IpRule[] = [
  {
    ip: '127.0.0.1',
    description: 'Localhost (IPv4)',
    addedAt: new Date().toISOString()
  },
  {
    ip: '::1',
    description: 'Localhost (IPv6)',
    addedAt: new Date().toISOString()
  }
]

/**
 * 環境変数から許可IPリストを取得
 */
export function getAllowedIpsFromEnv(): string[] {
  const envIps = process.env.ALLOWED_IPS
  if (!envIps) {
    return DEFAULT_ALLOWED_IPS.map(rule => rule.ip)
  }

  // カンマ区切りの文字列を配列に変換
  return envIps.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)
}

/**
 * IPアドレスの形式を検証
 */
export function isValidIpAddress(ip: string): boolean {
  // IPv4の正規表現
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  // IPv6の簡単な検証（完全ではないが基本的なケースをカバー）
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
  
  // CIDR記法の検証
  const cidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[0-9]|[1-2][0-9]|3[0-2])$/

  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || cidrRegex.test(ip)
}

/**
 * IPリストに新しいIPを追加
 */
export function addIpToAllowlist(currentList: string[], newIp: string): string[] {
  if (!isValidIpAddress(newIp)) {
    throw new Error(`Invalid IP address format: ${newIp}`)
  }

  if (currentList.includes(newIp)) {
    throw new Error(`IP address already exists: ${newIp}`)
  }

  return [...currentList, newIp]
}

/**
 * IPリストからIPを削除
 */
export function removeIpFromAllowlist(currentList: string[], ipToRemove: string): string[] {
  return currentList.filter(ip => ip !== ipToRemove)
}

/**
 * ログ出力用のフォーマット済みIPリスト
 */
export function formatIpList(ipList: string[]): string {
  return ipList.map((ip, index) => `  ${index + 1}. ${ip}`).join('\n')
}