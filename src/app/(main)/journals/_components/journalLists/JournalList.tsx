'use client'

import { JournalClient } from "@/types/journals";
import { useEffect, useState, useRef } from "react";
import { upsertJournalAction, deleteJournalAction } from "@/app/(main)/journals/_actions/journalActions";
import { useDebounce } from "use-debounce";
import { AccountType } from "@/types/accountTypes";
import { AssetType } from "@/types/assetTypes";
import TradeForm from "@/app/(main)/journals/_components/trades/TradeForm";
import { deleteTradeAction } from "@/app/(main)/journals/_actions/tradeActions";

type Props = {
  getJournals: JournalClient[],
  masters: {
    accountTypes: AccountType[];
    assetTypes: AssetType[];
  };
};

export default function JournalLists({ getJournals, masters }: Props) {
  const [allJournals, setAllJournals] = useState<JournalClient[]>(
    getJournals.map((journal) => ({ ...journal, isPersisted: true }))
  );
  const changeJournalId = useRef(0);
  const isFirstRender = useRef(true)
  const [actionError, setActionError] = useState<Record<number, string[]>>({}); //フォーム全体に関わるエラーステート

  // Journal新規追加時の初期値を設定
  const addJournal = () => {
    const id = -Date.now();
    setAllJournals([...allJournals, {
      id: id,
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
      trades: [],
    }]);
   handleAddTrade(id);
  }


  // upsert処理
  const handleUpdateJournal = (id: number, field: string, value: string | number | boolean | null) => {
    setAllJournals(allJournals.map((journal) =>
      journal.id === id ? { ...journal, [field]: value } : journal
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
          journal.id === debouncedJournal.id ? { ...journal, errors: result.errors } : journal
        ));
        setActionError(prevErrors => ({ ...prevErrors, [debouncedJournal.id]: result.errors.formErrors }));
      } else {
        setAllJournals(prevJournals => prevJournals.map(journal =>
          journal.id === debouncedJournal.id ? { ...journal, errors: undefined, id: result.id } : journal
        ));
        setActionError(prevErrors => {
          const { [debouncedJournal.id]: _, ...rest } = prevErrors;
          return rest;
        });
      }

      // 変更したJournalIDをリセット
      changeJournalId.current = 0;
    }
    saveJournal();
  }, [debouncedJournal]);

  // 削除処理（Journal用）
  const handleDeleteJournal = async (id: number) => {
    if (id >= 0) {
      const result = await deleteJournalAction(id);
      if (!result.success) {
        setActionError(prevErrors => ({ ...prevErrors, [id]: result.errors || ["削除に失敗しました。"] }));
        return;
      }
    }

    // ステートから削除
    setAllJournals(prevJournals => prevJournals.filter(journal => journal.id !== id));
    // エラメッセージクリア
    setActionError(prevErrors => {
      const { [id]: _, ...rest } = prevErrors;
        return rest;
      });
  }

  // 売買記録追加処理
  const handleAddTrade = (journalId: number) => {
    setAllJournals(prevJournals =>
      prevJournals.map(journal =>
        journal.id === journalId
          ? { ...journal, trades: [...journal.trades, { 
            id: -Date.now(),
            journalId: journalId,
            side: "BUY",
            priceValue: null,
            priceScale: null,
            quantityValue: null,
            quantityScale: null,
            tradedDate: null,
            reason: null,
            memo: null,
            displayOrder: journal.trades.length + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          }] }
          : journal
      )
    );
  }

  // 削除処理（Trade用）
  const handleDeleteTrade = async (journalId: number, tradeId: number) => {
    if (tradeId >= 0) {
      // 正のIDはDBに保存されているので、削除APIを呼ぶ
      const result = await deleteTradeAction(tradeId);
      if (!result.success) {
        // 削除失敗: エラーを表示して何もしない
        setActionError(prevErrors => ({ ...prevErrors, [tradeId]: result.errors?.formErrors || ["削除に失敗しました。"] }));
        return;
      }
    }

    // ステートから削除(負のIDも含む)
    setAllJournals(prevJournals =>
      prevJournals.map(journal =>
        journal.id === journalId
          ? { ...journal, trades: journal.trades.filter(trade => trade.id !== tradeId) }
          : journal
      )
    );
    // エラメッセージクリア
    setActionError(prevErrors => {
      const { [tradeId]: _, ...rest } = prevErrors;
      return rest;
    });
  }


  return (
    <div>
      <div>
        <button onClick={addJournal}>記録を追加</button>
      </div>
      {allJournals.map((journal) => (
        <div key={journal.id}>
          <div>
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
              <select name="baseCurrency" id="baseCurrency" value={journal.baseCurrency ?? "JPY"} onChange={(e) => handleUpdateJournal(journal.id, "baseCurrency", e.target.value)}>
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
              </select>
              <div>{journal.errors?.baseCurrency?.join(", ")}</div>
            </label>
            <label>
              <select name="accountType" id="accountType" value={journal.accountTypeId ?? ""} onChange={(e) => handleUpdateJournal(journal.id, "accountTypeId", e.target.value === "" ? null : Number(e.target.value))}>
                <option value="">口座タイプ</option>
                {masters.accountTypes.map((accountType) => (
                  <option key={accountType.id} value={accountType.id}>{accountType.nameJa}</option>
                ))}
              </select>
              <div>{journal.errors?.accountTypeId?.join(", ")}</div>
            </label>
            <label>
              <select name="assetType" id="assetType" value={journal.assetTypeId ?? ""} onChange={(e) => handleUpdateJournal(journal.id, "assetTypeId", e.target.value === "" ? null : Number(e.target.value))}>
                <option value="">投資タイプ</option>
                {masters.assetTypes.map((assetType) => (
                  <option key={assetType.id} value={assetType.id}>{assetType.nameJa}</option>
                ))}
              </select>
              <div>{journal.errors?.assetTypeId?.join(", ")}</div>
            </label>
            <label>
              <span>チェック</span>
                <input type="checkbox" name="checked" checked={journal.checked} onChange={(e) => handleUpdateJournal(journal.id, "checked", e.target.checked)} />
                <div>{journal.errors?.checked?.join(", ")}</div>
            </label>
            <div>{actionError?.[journal.id]?.join(", ")}</div>
          </div>
          <div>
            <p>売買記録</p>
            {journal.trades.map((trade) => (
              <div key={trade.id} >
                <TradeForm
                  journalId={journal.id}
                  tradeData={trade}
                  onDelete={() => handleDeleteTrade(journal.id, trade.id)}
                />
              </div>
            ))}
            <button type="button" onClick={() => handleAddTrade(journal.id)}>売買記録を追加</button>
          </div>
          <button type="button" onClick={() => handleDeleteJournal(journal.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
