import type { JournalsRepository } from "@/repositories/journals/journals.repository";
import getJournals from "@/repositories/journals/journals.drizzle";


export function getJournalsRepo(): JournalsRepository {
  return {
    getJournals,
  };
}
