import { TradeRow } from "@/types/trades";
import { getRepoContext } from "@/lib/server/getRepoContext";
import { z } from "zod";
import { ja } from "zod/locales";
import { and, eq } from "drizzle-orm";
import { trades } from "@/drizzle/schema/trades";
import { journals } from "@/drizzle/schema/journals";
import { JournalRow } from "@/types/journals";
import { checkPermissionJournal } from "@/repositories/utils/checkPermissionJournal";
import { convertDecimalToIntegerAndScale } from "@/repositories/utils/decimalScaleConverters";

// 日本語化
z.config(ja());

/** Trade データのバリデーションスキーマ */
const tradeInputSchema = z.object({
  id: z.number().int(),
  journalId: z.number().int(),
  side: z.enum(["BUY", "SELL"]),
  priceValue: z.number().optional().nullable(),
  priceScale: z.number().int().optional().nullable(),
  quantityValue: z.number().optional().nullable(),
  quantityScale: z.number().int().optional().nullable(),
  reason: z.string().optional().nullable(),
  memo: z.string().optional().nullable(),
  tradedDate: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
});

/** バリデーション済みTradeデータの型 */
type ValidatedTradeData = z.infer<typeof tradeInputSchema>;


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

  // 小数を整数とscaleに変換
  const priceConverted = convertDecimalToIntegerAndScale(validatedData.priceValue);
  const quantityConverted = convertDecimalToIntegerAndScale(validatedData.quantityValue);

  const dataForDb = {
    ...validatedData,
    priceValue: priceConverted.value,
    priceScale: priceConverted.scale ?? validatedData.priceScale,
    quantityValue: quantityConverted.value,
    quantityScale: quantityConverted.scale ?? validatedData.quantityScale,
  };

  // journalが作成されていない場合
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
    const result = await upsertTradeWithJournal(journalData, dataForDb);

    return { id: result.tradeId };
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
      const rows = await db.insert(trades).values({ ...dataForDb }).onConflictDoUpdate({
      target: trades.id,
      set: { ...dataForDb, updatedAt: new Date() },
    }).returning({ id: trades.id });

    return { id: rows[0].id };
  } else { // 新規作成
    const { id: _id, ...dataWithoutId } = dataForDb;
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
  
  const trade = await db.query.trades.findFirst({
    where: eq(trades.id, tradeId),
  });
  
  if (!trade) {
    return {
      success: false,
      errors: { formErrors: ["取引が見つかりません。"] }
    };
  }
  
  // journal の権限チェック
  const checkedPermissionJournal = await checkPermissionJournal(trade.journalId);
  if (!checkedPermissionJournal) {
    return {
      success: false,
      errors: { formErrors: ["権限がありません。"] }
    };
  }
  
  // 削除実行
  const result = await db.delete(trades).where(eq(trades.id, tradeId));

  if (!result.success) {
    return {
      success: false,
      errors: { formErrors: ["削除に失敗しました。"] }
    };
  }

  return { success: true };
};
