'use server'

import { getTradeFilesRepo } from "@/repositories/trade_files";
import type { TradeFileRow } from "@/types/tradeFiles";

// 取引ファイルの一覧取得時の型
type GetTradeFilesActionResult =
  | { success: true, fileRows: TradeFileRow[] }
  | { success: false, errors: Record<string, string[]> };

// 取引ファイルのupsert時の型
type UpsertTradeFileActionResult =
  | { success: true; id: number, r2Key: string; }
  | { success: false; errors: Record<string, string[]> };

// 取引ファイルの削除時の型
type DeleteTradeFileActionResult =
  | { success: true }
  | { success: false, errors: Record<string, string[]> };

// 取引ファイルの一覧取得処理
export async function getTradeFilesAction(tradeId: number): Promise<GetTradeFilesActionResult> {
  try {
    const result = await getTradeFilesRepo().getTradeFiles(tradeId);
    return { success: true, fileRows: result.fileRows };
  } catch (error) {
    console.error(error);
    return { success: false, errors: { formErrors: ["取得に失敗しました。"] } };
  }
}

// 取引ファイルの作成処理
export async function createTradeFileAction(tradeFile: TradeFileRow): Promise<UpsertTradeFileActionResult> {
  try {
    const result = await getTradeFilesRepo().createTradeFile(tradeFile);

    if (result?.errors) {
      return {
        success: false,
        errors: result.errors.fieldErrors,
      };
    }

    if (!result.id || !result.r2Key) {
      return { success: false, errors: { formErrors: ["保存に失敗しました。"] } };
    }

    return { success: true, id: result.id, r2Key: result.r2Key };
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}

// 取引ファイルの削除処理
export async function deleteTradeFileAction(id: number, r2Key: string): Promise<DeleteTradeFileActionResult> {
  try {
    // trade_filesテーブルからファイルを削除
    const result = await getTradeFilesRepo().deleteTradeFile(id);
    if (result?.success === false) {
      return {
        success: false,
        errors: { formErrors: ["削除に失敗しました。"] },
      };
    }

    // R2からファイルを削除
    const response = await fetch(`/api/fileUpload?key=${encodeURIComponent(r2Key)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return {
        success: false,
        errors: { formErrors: ["削除に失敗しました。"] },
      };
    }

    return { success: true };  
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}