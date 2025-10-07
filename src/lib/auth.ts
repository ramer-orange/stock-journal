import { auth } from '@/auth'
import { unauthorized } from 'next/navigation'

// 認証チェック
export default async function authCheck() {
  const session = await auth()
  if (!session?.user) {
    unauthorized();
  }
  return session.user as { id: string }
}