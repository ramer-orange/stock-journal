// src/lib/server/getRepoContext.ts
import "server-only";
import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { unauthorized } from "next/navigation";

export type RepoContext = { db: ReturnType<typeof connectDb>; userId: string };

/**
 * リポジトリコンテキストを取得
 * @returns {Promise<RepoContext>}
 */
export async function getRepoContext(): Promise<RepoContext> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    unauthorized();
  }

  const db = connectDb();
  return { db, userId };
}
