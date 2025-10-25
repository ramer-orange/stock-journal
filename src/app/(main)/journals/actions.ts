'use server'

import { getJournalsRepo } from "@/repositories/journals";
import { JournalWithRelations } from "@/types/journals";

// 戻り値の型を定義
type UpsertJournalActionResult =
  | { success: true, id: number }
  | { success: false; errors: Record<string, string[]> };

// upsert処理
export async function upsertJournalAction(journalData: JournalWithRelations): Promise<UpsertJournalActionResult> {
  try {
    const result = await getJournalsRepo().upsertJournal(journalData);

    if (result?.errors) {
      return {
        success: false,
        errors: result.errors.fieldErrors,
      };
    }

    if (!result.id) {
      return {
        success: false,
        errors: {
          formErrors: ["保存に失敗しました。"],
        },
      };
    }

    return { success: true, id: result.id };
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}

// delete処理
export async function deleteJournalAction(id: number) {
  try {
    const result = await getJournalsRepo().deleteJournal(id);

    if (result?.errors) {
      return {
        success: false,
        errors: result.errors,
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}