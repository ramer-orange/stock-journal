import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export type RepositoryContext = {
  db: ReturnType<typeof getDb>;
  session: Session;
};

export const getRepositoryContext = async (): Promise<RepositoryContext> => {
  const session = await auth();
  if (!session) {
    return redirect("/signIn");
  }

  const db = getDb();

  return { db, session };
};
