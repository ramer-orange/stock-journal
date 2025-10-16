'use client'

import { JournalWithRelations } from "@/types/journals";
import { useState } from "react";
import { useActionState } from 'react';
import { upsertJournalAction } from "@/app/(main)/journals/actions";

type Props = {
  getJournals: JournalWithRelations[],
};

export default function JournalLists({ getJournals }: Props) {
  // const [journalArray, setJournalArray] = useState(getJournals);

  const [state, formAction, isPending] = useActionState(upsertJournalAction, null);
  const [allJournals, setAllJournals] = useState(getJournals);


  const addJournal = () => {
    setAllJournals([...allJournals, {
      id: allJournals.length + 1,
      name: "",
      code: "",
      baseCurrency: "JPY",
      accountTypeId: null,
      assetTypeId: null,
      accountType: { id: 0, nameJa: "", code: "" },
      assetType: { id: 0, nameJa: "", code: "" },
      displayOrder: allJournals.length + 1,
      checked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "",
    }]);
  }

  const updateJournal = (id: number, field: string, value: string | number | boolean | null) => {
    setAllJournals(allJournals.map((journal) =>
      journal.id === id ? { ...journal, [field]: value }: journal
    ));
  }

  return (
    <div>
      <div>
        <button onClick={addJournal}>記録を追加</button>
      </div>
      {allJournals.map((journal) => (
        <div key={journal.id}>
          <form action={formAction}>
            <label>
              <span>名前</span>
              <input type="text" name="name" value={journal.name ?? ""} onChange={(e) => updateJournal(journal.id, "name", e.target.value)} />
            </label>
            <label>
              <span>コード</span>
              <input type="text" name="code" value={journal.code ?? ""} onChange={(e) => updateJournal(journal.id, "code", e.target.value)} />
            </label>
            <label>
              <span>通貨</span>
              <input type="text" name="baseCurrency" value={journal.baseCurrency ?? ""} onChange={(e) => updateJournal(journal.id, "baseCurrency", e.target.value)} />
            </label>
            <label>
              <span>口座タイプ</span>
              <input type="text" name="accountType" value={journal.accountType.nameJa ?? ""} onChange={(e) => updateJournal(journal.id, "accountType.nameJa", e.target.value)} />
            </label>
            <label>
              <span>投資タイプ</span>
              <input type="text" name="assetType" value={journal.assetType.nameJa ?? ""} onChange={(e) => updateJournal(journal.id, "assetType.nameJa", e.target.value)} />
            </label>
            <label>
              <span>チェック</span>
                <input type="checkbox" name="checked" checked={journal.checked} onChange={(e) => updateJournal(journal.id, "checked", e.target.checked)} />
            </label>
            <button type="submit">
              {isPending ? "保存中..." : "保存"}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
