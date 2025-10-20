import { getJournals, upsertJournal, deleteJournal } from "@/repositories/journals/journals.drizzle";
import { JournalWithRelations } from "@/types/journals";

export interface JournalsRepository {
  getJournals: () => Promise<JournalWithRelations[]>;
  upsertJournal: (journalData: JournalWithRelations) => Promise<{
    id?: number;
    errors?: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };
  }>;
  deleteJournal: (id: number) => Promise<{
    success: boolean;
    errors?: string[];
  }>;
}

export function getJournalsRepo(): JournalsRepository {
  return {
    getJournals,
    upsertJournal,
    deleteJournal,
  };
}
