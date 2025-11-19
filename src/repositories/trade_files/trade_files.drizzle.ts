import { getRepoContext } from "@/lib/server/getRepoContext";
import { tradeFiles } from "@/drizzle/schema/tradeFiles";
import type { TradeFileRow } from "@/types/tradeFiles";
import { z } from "zod";
import { ja } from "zod/locales";
import { eq } from "drizzle-orm";

// 日本語化
z.config(ja());

/** TradeFile データのバリデーションスキーマ */
const tradeFileInputSchema = z.object({
  tradeId: z.number().int().positive(),
  r2Key: z.string().max(255),
});

/**
 * 取引ファイルを取得
 *
 * @param tradeId
 * @returns
 */
export const getTradeFiles = async (tradeId: number): Promise<{ fileRows: TradeFileRow[] }> => {
  const { db } = await getRepoContext();
  const fileRows = await db.select().from(tradeFiles).where(eq(tradeFiles.tradeId, tradeId));

  return { fileRows };
};

/**
 * 取引ファイルを作成
 * @param tradeFile
 * @returns
 */
export const createTradeFile = async (tradeFile: TradeFileRow) => {
  const { db } = await getRepoContext();
  // バリデーション実行
  const validationResult = tradeFileInputSchema.safeParse(tradeFile);
  if (!validationResult.success) {
    const flattened = z.flattenError(validationResult.error);
    return {
      errors: {
        formErrors: [],
        fieldErrors: flattened.fieldErrors
      }
    };
  }
  const validatedData = validationResult.data;
  
  const rows = await db.insert(tradeFiles).values({ ...validatedData }).returning({ id: tradeFiles.id, r2Key: tradeFiles.r2Key });
  return { id: rows[0].id, r2Key: rows[0].r2Key };
};

/**
 * 取引ファイルを削除
 * @param id
 * @returns
 */
export const deleteTradeFile = async (id: number) => {
  const { db } = await getRepoContext();
  const result = await db.delete(tradeFiles).where(eq(tradeFiles.id, id)).returning({ id: tradeFiles.id });
  if (!result[0].id) {
    return {
      success: false,
      errors: { formErrors: ["削除に失敗しました。"] }
    };
  }

  return { success: true };
};
