import { getJournalsRepo } from "@/repositories/journals";
import JournalLists from "@/app/(main)/journals/_components/JournalLists/page";

const journalsPage = async () => {
  const journals = await getJournalsRepo().getJournals();

  return (
    <div>
      <div>journals</div>
      <JournalLists getJournals={journals} />
    </div>
  )
}

export default journalsPage