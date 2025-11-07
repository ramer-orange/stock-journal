import { getJournalsRepo } from "@/repositories/journals";
import JournalLists from "@/app/(main)/journals/_components/journalLists/JournalList";
import { getMastersRepo } from "@/repositories/masters";

const journalsPage = async () => {
  const journals = await getJournalsRepo().getJournals();
  const masters = await getMastersRepo().getMasters();
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-text-primary">取引記録</h1>
      </header>
      <JournalLists getJournals={journals} masters={masters} />
    </main>
  );
};

export default journalsPage