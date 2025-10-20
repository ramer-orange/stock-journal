import type { RepoContext } from "@/lib/server/getRepoContext";
import type { JournalWithRelations } from "@/types/journals";
import { and, eq } from "drizzle-orm";
import { getRepoContext } from "@/lib/server/getRepoContext";
import { journals } from "@/drizzle/schema/journals";
import { z } from "zod";
import { ja } from "zod/locales"

/** Journal データのバリデーションスキーマ */
const journalInputSchema = z.object({
  id: z.number().int().positive().optional(),
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
 * @param {JournalWithRelations} journalData - Journal data
 * @returns {Promise<void>}
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
  const existingJournal = validatedData.id
    ? await db.query.journals.findFirst({
        where: and(eq(journals.id, validatedData.id), eq(journals.userId, userId)),
      })
    : null;

  if (existingJournal) {
    // 更新：既存レコードがある場合
    await db
      .insert(journals)
      .values({ ...validatedData, userId })
      .onConflictDoUpdate({
        target: journals.id,
        set: {
          ...validatedData,
          userId,
          updatedAt: new Date()
        },
      });
  } else {
    // 新規作成：id を除外して挿入
    const { id, ...dataWithoutId } = validatedData;
    await db.insert(journals).values({ ...dataWithoutId, userId });
  }
};
