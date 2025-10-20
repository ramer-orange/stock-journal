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