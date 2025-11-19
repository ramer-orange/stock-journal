'use server'

import { getTradeFilesRepo } from "@/repositories/trade_files";
import type { TradeFileRow } from "@/types/tradeFiles";
import { getCloudflareContext } from '@opennextjs/cloudflare';

// 取引ファイルの一覧取得時の型
type GetTradeFilesActionResult =
  | { success: true, fileRows: TradeFileRow[] }
  | { success: false, errors: Record<string, string[]> };

// 取引ファイルのアップロード時の型
type UploadTradeFileActionResult =
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
export async function createTradeFileAction(formData: FormData): Promise<UploadTradeFileActionResult> {
  try {
    const file = formData.get('file') as File;
    const tradeId = Number(formData.get('tradeId'));

    if (!file || !tradeId) {
      return { success: false, errors: { formErrors: ["ファイルまたは取引IDが不足しています。"] } };
    }

    const { env } = getCloudflareContext();
    const r2Key = `trade-files/${crypto.randomUUID()}`;

    // R2にアップロード
    const arrayBuffer = await file.arrayBuffer(); // リクエスト本体をバイナリデータとして読み込む
    await env.R2_DEV.put(r2Key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // DBに保存
    const result = await getTradeFilesRepo().createTradeFile({ tradeId, r2Key });

    // DB保存に失敗した場合、R2からファイルを削除（ロールバック）
    if (result?.errors) {
      await env.R2_DEV.delete(r2Key);
      return {
        success: false,
        errors: result.errors.fieldErrors,
      };
    }
    // ID等が返ってこない場合も失敗とみなして削除
    if (!result.id || !result.r2Key) {
      await env.R2_DEV.delete(r2Key);
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
    const { env } = getCloudflareContext();
    await env.R2_DEV.delete(r2Key);

    return { success: true };  
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}