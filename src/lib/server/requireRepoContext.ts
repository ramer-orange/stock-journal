import { auth } from "@/auth";
import { connectDb } from "@/lib/db";
import { redirect } from "next/navigation";

export type RepoContext = {
  db: ReturnType<typeof connectDb>;
  userId: string;
};

export const requireRepoContext = async (): Promise<RepoContext> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return redirect("/signIn");
  }

  const db = connectDb();
  return { db, userId };
};
