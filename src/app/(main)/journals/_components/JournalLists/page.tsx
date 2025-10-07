import { Journal } from "@/types/journals";

type Props = { journals: Journal[] };

export default function JournalLists({ journals }: Props) {
  return (
    <div>
      {(journals).map((journal) => (
        <div key={journal.id}>{journal.name}</div>
      ))}
    </div>
  );
}
