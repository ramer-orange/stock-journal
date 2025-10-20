'use client'

import { JournalClient} from "@/types/journals";
import { useEffect, useState, useRef } from "react";
import { upsertJournalAction } from "@/app/(main)/journals/actions";
import { useDebounce } from "use-debounce";

type Props = {
  getJournals: JournalClient[],
};

export default function JournalLists({ getJournals }: Props) {
  const [allJournals, setAllJournals] = useState(getJournals);
  const changeJournalId = useRef(0);
  const isFirstRender = useRef(true)

  // Journal新規追加時の初期値を設定
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


  // upsert処理
  const handleUpdateJournal = (id: number, field: string, value: string | number | boolean | null) => {
    setAllJournals(allJournals.map((journal) =>
      journal.id === id ? { ...journal, [field]: value }: journal
    ));
    // 変更したJournalIDを更新
    changeJournalId.current = id;
  }
  // デバウンス処理で保存
  const [debouncedJournal] = useDebounce(
    allJournals.find((journal) => journal.id === changeJournalId.current),
    500
  );
  useEffect(() => {
    // 初回レンダリング時は保存処理は行わない
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // undefinedの場合は保存しない
    if (!debouncedJournal) {
      return;
    }
    
    const saveJournal = async () => {
      const result = await upsertJournalAction(debouncedJournal);
      if (!result.success) {
        setAllJournals(prevJournals => prevJournals.map(journal =>
          journal.id === debouncedJournal.id ? { ...journal, errors: result.errors }: journal
        ));
      } else {
        setAllJournals(prevJournals => prevJournals.map(journal =>
          journal.id === debouncedJournal.id ? { ...journal, errors: undefined }: journal
        ));
      }

      // 変更したJournalIDをリセット
      changeJournalId.current = 0;
    }
    saveJournal();
  }, [debouncedJournal]);


  return (
    <div>
      <div>
        <button onClick={addJournal}>記録を追加</button>
      </div>
      {allJournals.map((journal) => (
        <div key={journal.id}>
          <form>
            <label>
              <span>名前</span>
              <input type="text" name="name" value={journal.name ?? ""} onChange={(e) => handleUpdateJournal(journal.id, "name", e.target.value)} />
              <div>{journal.errors?.name?.join(", ")}</div>
            </label>
            <label>
              <span>コード</span>
              <input type="text" name="code" value={journal.code ?? ""} onChange={(e) => handleUpdateJournal(journal.id, "code", e.target.value)} />
              <div>{journal.errors?.code?.join(", ")}</div>
            </label>
            <label>
              <span>通貨</span>
              <input type="text" name="baseCurrency" value={journal.baseCurrency ?? "JPY"} onChange={(e) => handleUpdateJournal(journal.id, "baseCurrency", e.target.value)} />
              <div>{journal.errors?.baseCurrency?.join(", ")}</div>
            </label>
            <label>
              <span>口座タイプ</span>
              <input type="text" name="accountType" value={journal.accountType?.nameJa ?? ""} onChange={(e) => handleUpdateJournal(journal.id, "accountType.nameJa", e.target.value)} />
              <div>{journal.errors?.accountTypeId?.join(", ")}</div>
            </label>
            <label>
              <span>投資タイプ</span>
              <input type="text" name="assetType" value={journal.assetType?.nameJa ?? ""} onChange={(e) => handleUpdateJournal(journal.id, "assetType.nameJa", e.target.value)} />
              <div>{journal.errors?.assetTypeId?.join(", ")}</div>
            </label>
            <label>
              <span>チェック</span>
                <input type="checkbox" name="checked" checked={journal.checked} onChange={(e) => handleUpdateJournal(journal.id, "checked", e.target.checked)} />
                <div>{journal.errors?.checked?.join(", ")}</div>
            </label>
          </form>
        </div>
      ))}
    </div>
  );
}
