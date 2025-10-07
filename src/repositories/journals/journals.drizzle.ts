import { JournalWithRelations } from "@/types/journals";
import { eq } from "drizzle-orm";
import { journals } from "@/drizzle/schema/journals";
import { getRepositoryContext } from "@/repositories/context";

const getJournals = async (): Promise<JournalWithRelations[]> => {
  try {
    const { db, session } = await getRepositoryContext()
    const userId = session.user?.id
    if (!userId) {
      return [];
    }
    const data = await db.query.journals.findMany({
      where: eq(journals.userId, userId),
      with: {
        accountType: true,
        assetType: true,
      },
    });
    return data as JournalWithRelations[];
  } catch (error) {
    console.error('Error fetching journals:', error);
    return [];
  }
}

export default getJournals;