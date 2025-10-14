import type { RepoContext } from "@/lib/server/getRepoContext";
import type { JournalWithRelations } from "@/types/journals";
import { and, eq } from "drizzle-orm";
import { getRepoContext } from "@/lib/server/getRepoContext";
import { journals } from "@/drizzle/schema/journals";
import { zfd } from "zod-form-data";
import { z } from "zod";

/** FormData を DB に保存する型に変換するスキーマ */
const formSchema = zfd.formData({
  id: zfd.numeric(z.number().int().positive()).optional(),
  accountTypeId: zfd.numeric(z.number().int().positive()).optional().nullable(),
  assetTypeId: zfd.numeric(z.number().int().positive()).optional().nullable(),
  baseCurrency: zfd
    .text(z.enum(["USD", "JPY"]))
    .optional()
    .transform((v) => v?.trim().toUpperCase() as "USD" | "JPY"),
  name: zfd.text().optional().nullable(),
  code: zfd.text().optional().nullable(),
  displayOrder: zfd.numeric(z.number().int().nonnegative()).catch(0),
  checked: zfd.checkbox().catch(false),
});

/** ID でジャーナルを取得（リレーション付き） */
const fetchJournalById = async (
  db: RepoContext["db"],
  id: number,
  userId: string,
): Promise<JournalWithRelations> => {
  const journal = await db.query.journals.findFirst({
    where: and(eq(journals.id, id), eq(journals.userId, userId)),
    with: { accountType: true, assetType: true },
  });
  if (!journal) throw new Error("ジャーナルが見つかりません");
  return journal as JournalWithRelations;
};

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
 * 記録を upsert。id があれば更新、無ければ新規作成。
 * @param {FormData} formData
 * @returns {Promise<JournalWithRelations>}
 */
export const upsertJournal = async (formData: FormData): Promise<JournalWithRelations> => {
  const { db, userId } = await getRepoContext();
  const { id, ...data } = formSchema.parse(formData);

  // 更新処理
  if (id) {
    const [updated] = await db
      .update(journals)
      .set(data)
      .where(and(eq(journals.id, id), eq(journals.userId, userId)))
      .returning({ id: journals.id });

    if (!updated) throw new Error("ジャーナルが見つかりません");
    return fetchJournalById(db, updated.id, userId);
  }

  // 新規作成処理
  const [inserted] = await db
    .insert(journals)
    .values({ ...data, userId })
    .returning({ id: journals.id });

  if (!inserted) throw new Error("Failed to create journal");
  return fetchJournalById(db, inserted.id, userId);
};
