import type { JournalWithRelations } from "@/types/journals";
import { eq } from "drizzle-orm";
import { journals } from "@/drizzle/schema/journals";
import { getRepoContext } from "@/lib/server/getRepoContext";
import { sql } from 'drizzle-orm';

/**
 * 記録一覧を取得
 * @returns {Promise<JournalWithRelations[]>}
 */
export const getJournals = async (): Promise<JournalWithRelations[]> => {
  const { db, userId } = await getRepoContext();

  const result = await db.query.journals.findMany({
    where: eq(journals.userId, userId),
    with: {
      accountType: true,
      assetType: true,
    },
  });

  return result as JournalWithRelations[];
}

/**
 * 記録をupsert
 * @param journal
 * @returns {Promise<JournalWithRelations>}
 */
export const upsertJournal = async (formData: FormData ) => {
  const { db, userId } = await getRepoContext();

  // upsert
  const [result] = await db
    .insert(journals)
    .values({
      userId: userId,
      accountTypeId: formData.get("accountTypeId") ?? null,
      assetTypeId: formData.get("assetTypeId") ?? null,
      code: formData.get("code") ?? null,
      name: formData.get("name") ?? null,
      baseCurrency: formData.get("baseCurrency") ?? "JPY",
      displayOrder: formData.get("displayOrder") ?? null,
      checked: formData.get("checked") ?? false,
    })
    .onConflictDoUpdate({
      target: journals.id,
      set: {
        accountTypeId: sql`excluded.${journals.accountTypeId.name}`,
        assetTypeId:   sql`excluded.${journals.assetTypeId.name}`,
        baseCurrency:  sql`excluded.${journals.baseCurrency.name}`,
        name:          sql`excluded.${journals.name.name}`,
        code:          sql`excluded.${journals.code.name}`,
        displayOrder:  sql`excluded.${journals.displayOrder.name}`,
        checked:       sql`excluded.${journals.checked.name}`,
        updatedAt:     new Date(),
      }
    })
    .returning({ id: journals.id });

    return result as JournalWithRelations;
};
