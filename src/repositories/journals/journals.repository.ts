import { JournalWithRelations } from "@/types/journals";

export interface JournalsRepository {
  getJournals: () => Promise<JournalWithRelations[]>;
  upsertJournal: (formData: FormData) => Promise<JournalWithRelations>;
}