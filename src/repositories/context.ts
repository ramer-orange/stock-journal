import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export type RepositoryContext = {
  db: ReturnType<typeof connectDb>;
  session: Session;
};

export const getRepositoryContext = async (): Promise<RepositoryContext> => {
  const session = await auth();
  if (!session) {
    return redirect("/signIn");
  }

  const db = connectDb();

  return { db, session };
};
