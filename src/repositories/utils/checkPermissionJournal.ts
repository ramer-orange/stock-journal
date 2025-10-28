import { getRepoContext } from "@/lib/server/getRepoContext";
import { and, eq } from "drizzle-orm";
import { journals } from "@/drizzle/schema/journals";


/**
* 権限チェック（journal）
*
* @param {number} journalId - Journal ID
* @returns {Promise<boolean>}
*/
export const checkPermissionJournal = async (journalId: number) => {
  const { db, userId } = await getRepoContext();
  const result = await db.query.journals.findFirst({
    where: and(eq(journals.id, journalId), eq(journals.userId, userId)),
  });

  return !!result;
};