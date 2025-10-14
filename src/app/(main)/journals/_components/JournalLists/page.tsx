'use client'

import { JournalWithRelations } from "@/types/journals";
import { useState } from "react";
import { useActionState } from 'react';
import { upsertJournalAction } from "@/app/(main)/journals/actions";

type Props = {
  journals: JournalWithRelations[],
};

export default function JournalLists({ journals }: Props) {
  const [name, setName] = useState(journals[0].name ?? "")
  const [code, setCode] = useState(journals[0].code ?? "")
  const [baseCurrency, setBaseCurrency] = useState(journals[0].baseCurrency ?? "JPY")
  const [accountType, setAccountType] = useState(journals[0].accountType.nameJa ?? "")
  const [assetType, setAssetType] = useState(journals[0].assetType.nameJa ?? "")
  const [checked, setChecked] = useState(journals[0].checked)

  const [, formAction, isPending] = useActionState(upsertJournalAction, null);

  return (
    <div>
      {(journals).map((journal) => (
        <div key={journal.id}>
          <form action={formAction}>
            <label>
              <span>名前</span>
              <input type="text" name="name" value={journal.name ?? name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              <span>コード</span>
              <input type="text" name="code" value={journal.code ?? code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <label>
              <span>通貨</span>
              <input type="text" name="baseCurrency" value={journal.baseCurrency ?? baseCurrency} onChange={(e) => setBaseCurrency(e.target.value as "JPY" | "USD") } />
            </label>
            <label>
              <span>口座タイプ</span>
              <input type="text" name="accountType" value={journal.accountType.nameJa ?? accountType} onChange={(e) => setAccountType(e.target.value)} />
            </label>
            <label>
              <span>投資タイプ</span>
              <input type="text" name="assetType" value={journal.assetType.nameJa ?? assetType} onChange={(e) => setAssetType(e.target.value)} />
            </label>
            <label>
              <span>チェック</span>
              <input type="checkbox" name="checked" checked={journal.checked ?? checked} onChange={(e) => setChecked(e.target.checked)} />
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
