import type { JournalsRepository } from "@/repositories/journals/journals.repository";
import { getJournals, upsertJournal } from "@/repositories/journals/journals.drizzle";

export function getJournalsRepo(): JournalsRepository {
  return {
    getJournals,
    upsertJournal,
  };
}
