import { Journal } from "@/types/journals";
import { eq } from "drizzle-orm";
import { journals } from "@/drizzle/schema/journals";
import { getRepositoryContext } from "@/repositories/context";

const getJournals = async (): Promise<Journal[]> => {
  try {
    const { db, session } = await getRepositoryContext()
    const userId = session.user?.id
    if (!userId) {
      return [];
    }
    const data = await db.query.journals.findMany({
      where: eq(journals.userId, userId),
    });
    return data as Journal[];
  } catch (error) {
    console.error('Error fetching journals:', error);
    return [];
  }
}

export default getJournals;