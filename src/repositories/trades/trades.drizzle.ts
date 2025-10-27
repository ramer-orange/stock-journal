import { TradeRow } from "@/types/trades";
import { getRepoContext } from "@/lib/server/getRepoContext";
import { z } from "zod";
import { ja } from "zod/locales";
import { and, eq } from "drizzle-orm";
import { trades } from "@/drizzle/schema/trades";
import { journals } from "@/drizzle/schema/journals";
import { JournalRow } from "@/types/journals";

// 日本語化
z.config(ja());

/** Trade データのバリデーションスキーマ */
const tradeInputSchema = z.object({
  id: z.number().int(),
  journalId: z.number().int(),
  side: z.enum(["BUY", "SELL"]),
  priceValue: z.number().int().optional().nullable(),
  priceScale: z.number().int().optional().nullable(),
  quantityValue: z.number().int().optional().nullable(),
  quantityScale: z.number().int().optional().nullable(),
  reason: z.string().optional().nullable(),
  memo: z.string().optional().nullable(),
  tradedDate: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
});

/** バリデーション済みTradeデータの型 */
type ValidatedTradeData = z.infer<typeof tradeInputSchema>;


/**
* 権限チェック（journal）
*
* @param {number} journalId - Journal ID
* @returns {Promise<boolean>}
*/
export const checkPermissionJournal = async (journalId: number) => {
  const { db, userId } = await getRepoContext();
  return await db.query.journals.findFirst({
    where: and(eq(journals.id, journalId), eq(journals.userId, userId)),
  });
};


/**
 * tradeを upsert
 *
 * @param {TradeRow} tradeData - Trade data
 * @returns {Promise<{ id: number }>}
 */
export const upsertTrade = async (tradeData: TradeRow) => {
  const { db, userId } = await getRepoContext();
  // バリデーション実行
  const validationResult = tradeInputSchema.safeParse(tradeData);
  if (!validationResult.success) {
    const flattened = z.flattenError(validationResult.error);
    return {
      errors: {
        formErrors: [],
        fieldErrors: flattened.fieldErrors
      }
    }
  }
  const validatedData = validationResult.data;

  if (validatedData.journalId < 0) {
    const journalData: JournalRow = {
      id: -Date.now(),
      userId: userId,
      name: "",
      code: "",
      baseCurrency: "JPY",
      accountTypeId: null,
      assetTypeId: null,
      displayOrder: -Date.now()+1,
      checked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await upsertTradeWithJournal(journalData, validatedData);

    if (result?.tradeId) {
      return { id: result.tradeId };
    }

    return {
      errors: {
        formErrors: ["保存に失敗しました。"],
        fieldErrors: {}
      }
    };
  }

  // 権限チェック
  const checkedPermissionJournal = await checkPermissionJournal(tradeData.journalId);
  if (!checkedPermissionJournal) {
    return { errors: { formErrors: ["権限がありません。"], fieldErrors: {} } };
  }

  // DBに存在するかチェック
  const existingTrade = validatedData.id > 0
    ? await db.query.trades.findFirst({
        where: and(eq(trades.id, validatedData.id), eq(trades.journalId, validatedData.journalId)),
      })
    : null;

  if (existingTrade) { //　更新
      const rows = await db.insert(trades).values({ ...validatedData }).onConflictDoUpdate({
      target: trades.id,
      set: { ...validatedData, updatedAt: new Date() },
    }).returning({ id: trades.id });

    return { id: rows[0].id };
  } else { // 新規作成
    const { id: _id, ...dataWithoutId } = validatedData;
    const rows = await db.insert(trades).values({ ...dataWithoutId }).returning({ id: trades.id });
    return { id: rows[0].id };
  }
};

/**
 * JournalとTradeを同時にupsert
 *
 * @param JournalData
 * @param validatedTradeData
 * @returns
 */
export const upsertTradeWithJournal = async (JournalData: JournalRow, validatedTradeData: ValidatedTradeData) => {
  const { db } = await getRepoContext();
  const { id: _journalid, ...journalDataWithoutId } = JournalData;
  const { id: _tradeId, ...tradeDataWithoutId } = validatedTradeData;

  let journalId: number | undefined;

  // Cloudflare D1ではトランザクションが使えないため、順次挿入
  try {
    // journal を作成
    const journalResult = await db.insert(journals).values({ ...journalDataWithoutId }).returning({ id: journals.id });
    journalId = journalResult[0].id;

    // journalId を使って trade を作成
    const insertTradeData = { ...tradeDataWithoutId, journalId };
    const tradeId = await db.insert(trades).values(insertTradeData).returning({ id: trades.id });

    return { journalId, tradeId: tradeId[0].id };
  } catch (error) {
    // エラー時に作成した journal を削除（手動ロールバック）
    if (journalId) {
      await db.delete(journals).where(eq(journals.id, journalId));
    }
    throw error;
  }
}

/**
 * trade削除
 *
 * @param tradeId
 * @returns
 */
export const deleteTrade = async (tradeId: number) => {
  const { db } = await getRepoContext();
  
  // trade を取得して journalId を取得
  const trade = await db.query.trades.findFirst({
    where: eq(trades.id, tradeId),
  });
  
  if (!trade) {
    return { errors: { formErrors: ["取引が見つかりません。"] } };
  }
  
  // journal の権限チェック
  const checkedPermissionJournal = await checkPermissionJournal(trade.journalId);
  if (!checkedPermissionJournal) {
    return { errors: { formErrors: ["権限がありません。"] } };
  }
  
  // 削除実行
  await db.delete(trades).where(eq(trades.id, tradeId));
  return { success: true };
};