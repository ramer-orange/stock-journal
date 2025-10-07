
import { Journal } from "@/types/journals";

export interface JournalsRepository {
  getJournals: () => Promise<Journal[]>;
}