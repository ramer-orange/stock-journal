import { Journal } from "@/types/journals";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { journals } from "@/drizzle/schema/journals";

const getJournals = async (): Promise<Journal[]> => {
  try {
    const db = getDb()
    const session = await auth()
    const data = await db.query.journals.findMany({
      where: eq(journals.userId, session?.user?.id ?? ""),
    });
    return data as Journal[];
  } catch (error) {
    console.error('Error fetching journals:', error);
    return [];
  }
}

export default getJournals;