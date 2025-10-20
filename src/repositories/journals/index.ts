import { getJournals, upsertJournal } from "@/repositories/journals/journals.drizzle";
import { JournalWithRelations } from "@/types/journals";

export interface JournalsRepository {
  getJournals: () => Promise<JournalWithRelations[]>;
  upsertJournal: (journalData: JournalWithRelations) => Promise<{
    errors: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };
  } | void>;
}

export function getJournalsRepo(): JournalsRepository {
  return {
    getJournals,
    upsertJournal,
  };
}
