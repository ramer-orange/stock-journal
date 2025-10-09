'use server'

import { getJournalsRepo } from "@/repositories/journals";

export async function upsertJournalAction(prevState: unknown, queryData: FormData) {
  await getJournalsRepo().upsertJournal(queryData);
}