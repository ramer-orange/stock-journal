import type { JournalWithRelations } from "@/types/journals";
import { and, eq } from "drizzle-orm";
import { getRepoContext } from "@/lib/server/getRepoContext";
import { journals } from "@/drizzle/schema/journals";
import { z } from "zod";
import { ja } from "zod/locales"

/** Journal データのバリデーションスキーマ */
const journalInputSchema = z.object({
  id: z.number().int().optional(),
  accountTypeId: z.number().int().positive().nullable().optional(),
  assetTypeId: z.number().int().positive().nullable().optional(),
  baseCurrency: z.enum(["USD", "JPY"]).optional(),
  name: z.string().max(255).nullable().optional(),
  code: z.string().max(255).nullable().optional(),
  displayOrder: z.number().int(),
  checked: z.boolean(),
});

// 日本語化
z.config(ja());

/**
 * 記録一覧を取得
 *
 * @returns {Promise<JournalWithRelations[]>}
 */
export const getJournals = async (): Promise<JournalWithRelations[]> => {
  const { db, userId } = await getRepoContext();

  const journalLists = await db.query.journals.findMany({
    where: eq(journals.userId, userId),
    with: {
      accountType: true,
      assetType: true,
    },
  });

  return journalLists as JournalWithRelations[];
};

/**
 * journalを upsert
 *
 * @param {JournalWithRelations} journalData - Journal data
 * @returns {Promise<{ id: number }>}
 */
export const upsertJournal = async (journalData: JournalWithRelations) => {
  const { db, userId } = await getRepoContext();

  // バリデーション実行
  const validationResult = journalInputSchema.safeParse({
    id: journalData.id,
    accountTypeId: journalData.accountTypeId,
    assetTypeId: journalData.assetTypeId,
    baseCurrency: journalData.baseCurrency,
    name: journalData.name,
    code: journalData.code,
    displayOrder: journalData.displayOrder,
    checked: journalData.checked,
  });

  if (!validationResult.success) {
    return {
      errors: z.flattenError(validationResult.error)
    }
  }

  const validatedData = validationResult.data;

  // DBに存在するかチェック（所有者確認も兼ねる）
  const existingJournal = validatedData.id && validatedData.id > 0
    ? await db.query.journals.findFirst({
        where: and(eq(journals.id, validatedData.id), eq(journals.userId, userId)),
      })
    : null;

  if (existingJournal) {
    // 更新：既存レコードがある場合
    const rows = await db
      .insert(journals)
      .values({ ...validatedData, userId })
      .onConflictDoUpdate({
        target: journals.id,
        set: {
          ...validatedData,
          userId,
          updatedAt: new Date()
        },
      })
      .returning({ id: journals.id });

      // 配列からidを取り出す
      return { id: rows[0].id };
  } else {
    // 新規作成：id を除外して挿入
    const { id: _id, ...dataWithoutId } = validatedData;
    const rows = await db.insert(journals).values({ ...dataWithoutId, userId }).returning({ id: journals.id });

    // 配列からidを取り出す
    return { id: rows[0].id };
  }
};

/**
 * journal削除
 *
 * @param id
 */
export const deleteJournal = async (id: number) => {
  const { db, userId } = await getRepoContext();

  const result = await db.delete(journals).where(and(eq(journals.id, id), eq(journals.userId, userId)));

  return result;
};