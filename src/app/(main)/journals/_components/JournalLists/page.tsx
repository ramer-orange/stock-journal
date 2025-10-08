import { JournalWithRelations } from "@/types/journals";

type Props = { journals: JournalWithRelations[] };

export default function JournalLists({ journals }: Props) {
  return (
    <div>
      {(journals).map((journal) => (
        <div key={journal.id}>
          <div>{journal.name ?? "-"}</div>
          <div>{journal.code ?? "-"}</div>
          <div>{journal.baseCurrency}</div>
          <div>{journal.accountType.nameJa}</div>
          <div>{journal.assetType.nameJa}</div>
          <div>{journal.checked}</div>
        </div>
      ))}
    </div>
  );
}
