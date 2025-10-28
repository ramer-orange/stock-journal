import { getJournalsRepo } from "@/repositories/journals";
import JournalLists from "@/app/(main)/journals/_components/journalLists/JournalList";
import { getMastersRepo } from "@/repositories/masters";

const journalsPage = async () => {
  const journals = await getJournalsRepo().getJournals();
  const masters = await getMastersRepo().getMasters();
  return (
    <div>
      <div>journals</div>
      <JournalLists getJournals={journals} masters={masters} />
    </div>
  )
}

export default journalsPage