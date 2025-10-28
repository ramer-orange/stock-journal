'use server'

import { getTradesRepo } from "@/repositories/trades";
import { TradeRow } from "@/types/trades";

// 戻り値の型を定義
type UpsertTradeActionResult =
  | { success: true, id: number }
  | { success: false; errors: Record<string, string[]> };

//
export async function upsertTradeAction(tradeData: TradeRow): Promise<UpsertTradeActionResult> {
  try {
    const result = await getTradesRepo().upsertTrade(tradeData);

    if (result?.errors) {
      return {
        success: false,
        errors: result.errors.fieldErrors,
      };
    }

    if (!result.id) {
      return { success: false, errors: { formErrors: ["保存に失敗しました。"] } };
    }

    return { success: true, id: result.id };
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}

// delete処理
export async function deleteTradeAction(tradeId: number) {
  try {
    const result = await getTradesRepo().deleteTrade(tradeId);
    if (result?.errors) {
      return {
        success: false,
        errors: { formErrors: result.errors.formErrors },
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}