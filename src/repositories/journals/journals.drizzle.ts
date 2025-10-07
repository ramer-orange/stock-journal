import type { JournalWithRelations } from "@/types/journals";
import { eq } from "drizzle-orm";
import { journals } from "@/drizzle/schema/journals";
import { getRepoContext } from "@/lib/server/getRepoContext";

/**
 * 記録一覧を取得
 * @returns {Promise<JournalWithRelations[]>}
 */
const getJournals = async (): Promise<JournalWithRelations[]> => {
  const { db, userId } = await getRepoContext();

  return db.query.journals.findMany({
    where: eq(journals.userId, userId),
    with: {
      accountType: true,
      assetType: true,
    },
  });
}

export default getJournals;
