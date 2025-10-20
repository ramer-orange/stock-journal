import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { D1Adapter, up } from "@auth/d1-adapter"

let migrated = false

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const { env } = getCloudflareContext()
  const clientId = env.AUTH_GOOGLE_ID ?? process.env.AUTH_GOOGLE_ID
  const clientSecret = env.AUTH_GOOGLE_SECRET ?? process.env.AUTH_GOOGLE_SECRET
  const secret = env.AUTH_SECRET ?? process.env.AUTH_SECRET
  const db = env.stock_journal_db

  if (!migrated) {
    try {
      await up(db)
    } catch (error) {
      console.error("[auth][migrate]", (error as Error)?.message ?? error)
    }
    migrated = true
  }

  return {
    providers: [
      Google({
        clientId,
        clientSecret,
      }),
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      session({ session, user }) {
        session.user.id = user.id
        return session
      },
    },
    secret,
    adapter: D1Adapter(db),
  }
})
