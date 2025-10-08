
import { JournalWithRelations } from "@/types/journals";

export interface JournalsRepository {
  getJournals: () => Promise<JournalWithRelations[]>;
}