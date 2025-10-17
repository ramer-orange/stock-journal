'use server'

import { getJournalsRepo } from "@/repositories/journals";
import { JournalWithRelations } from "@/types/journals";

export async function upsertJournalAction(journalData: JournalWithRelations) {
  await getJournalsRepo().upsertJournal(journalData);
}