'use server'

import { getJournalsRepo } from "@/repositories/journals";
import { JournalWithRelations } from "@/types/journals";

// 戻り値の型を定義
type UpsertJournalActionResult =
  | { success: true }
  | { success: false; errors: Record<string, string[]> };

export async function upsertJournalAction(journalData: JournalWithRelations): Promise<UpsertJournalActionResult> {
  try {
    const result = await getJournalsRepo().upsertJournal(journalData);

    if (result?.errors) {
      return {
        success: false,
        errors: result.errors.fieldErrors,
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error('予期せぬエラーが発生しました。');
  }
}