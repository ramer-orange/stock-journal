'use client'

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import TradeForm from "@/app/(main)/journals/_components/trades/TradeForm";
import { deleteTradeAction } from "@/app/(main)/journals/_actions/tradeActions";
import { deleteJournalAction, upsertJournalAction } from "@/app/(main)/journals/_actions/journalActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AccountType } from "@/types/accountTypes";
import { AssetType } from "@/types/assetTypes";
import { JournalClient } from "@/types/journals";

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
          const nextErrors = { ...prevErrors };
          delete nextErrors[debouncedJournal.id];
          return nextErrors;
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
        setActionError(prevErrors => ({ ...prevErrors, [id]: result.errors?.formErrors || ["削除に失敗しました。"] }));
        return;
      }
    }

    // ステートから削除
    setAllJournals(prevJournals => prevJournals.filter(journal => journal.id !== id));
    // エラメッセージクリア
    setActionError(prevErrors => {
      const nextErrors = { ...prevErrors };
      delete nextErrors[id];
      return nextErrors;
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
      const nextErrors = { ...prevErrors };
      delete nextErrors[tradeId];
      return nextErrors;
    });
  }


  return (
    <section className="space-y-4 pb-24">
      <div className="space-y-4">
        {allJournals.length === 0 ? (
          <Card className="border-dashed border-border/60 bg-base-light/60 p-5">
            <CardContent className="items-center justify-center gap-2 text-center">
              <p className="text-sm text-text-secondary">まだ記録が登録されていません。</p>
              <Button size="sm" onClick={addJournal}>
                最初の記録を作成
              </Button>
            </CardContent>
          </Card>
        ) : (
          allJournals.map((journal) => {
            const journalErrors = journal.errors ?? {};
            const baseCurrencyValue = journal.baseCurrency ?? "JPY";
            const isDraft = journal.id < 0;
            const hasTrades = journal.trades.length > 0;

            return (
              <Card key={journal.id} className="bg-base-light/95 p-4 md:p-5">
                <CardHeader className="mb-3 pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                        <span>{journal.name || "無題の記録"}</span>
                        {isDraft && <Badge variant="neutral">下書き</Badge>}
                      </CardTitle>
                      <p className="text-xs text-text-secondary md:text-sm">
                        {journal.code
                          ? `${journal.code}・${baseCurrencyValue}`
                          : `通貨: ${baseCurrencyValue}`}
                      </p>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteJournal(journal.id)}
                    >
                      記録を削除
                    </Button>
                  </div>
                  <ErrorMessage messages={actionError?.[journal.id]} className="mt-2" />
                </CardHeader>

                <CardContent className="gap-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        名前
                      </span>
                      <Input
                        name="name"
                        value={journal.name ?? ""}
                        placeholder="例: 国内株デイトレ口座"
                        size="sm"
                        onChange={(e) => handleUpdateJournal(journal.id, "name", e.target.value)}
                        hasError={Boolean(journalErrors.name?.length)}
                      />
                      {journalErrors.name && (
                        <p className="text-xs text-red-400">{journalErrors.name.join("、")}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        コード
                      </span>
                      <Input
                        name="code"
                        value={journal.code ?? ""}
                        placeholder="証券コードや口座名を入力"
                        size="sm"
                        onChange={(e) => handleUpdateJournal(journal.id, "code", e.target.value)}
                        hasError={Boolean(journalErrors.code?.length)}
                      />
                      {journalErrors.code && (
                        <p className="text-xs text-red-400">{journalErrors.code.join("、")}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        基軸通貨
                      </span>
                      <Select
                        name="baseCurrency"
                        value={baseCurrencyValue}
                        size="sm"
                        onChange={(e) => handleUpdateJournal(journal.id, "baseCurrency", e.target.value)}
                        hasError={Boolean(journalErrors.baseCurrency?.length)}
                      >
                        <option value="JPY">JPY - 日本円</option>
                        <option value="USD">USD - 米ドル</option>
                      </Select>
                      {journalErrors.baseCurrency && (
                        <p className="text-xs text-red-400">{journalErrors.baseCurrency.join("、")}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        口座タイプ
                      </span>
                      <Select
                        name="accountType"
                        value={journal.accountTypeId ? String(journal.accountTypeId) : ""}
                        onChange={(e) =>
                          handleUpdateJournal(
                            journal.id,
                            "accountTypeId",
                            e.target.value === "" ? null : Number(e.target.value),
                          )
                        }
                        size="sm"
                        hasError={Boolean(journalErrors.accountTypeId?.length)}
                      >
                        <option value="">選択してください</option>
                        {masters.accountTypes.map((accountType) => (
                          <option key={accountType.id} value={accountType.id}>
                            {accountType.nameJa}
                          </option>
                        ))}
                      </Select>
                      {journalErrors.accountTypeId && (
                        <p className="text-xs text-red-400">{journalErrors.accountTypeId.join("、")}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        投資タイプ
                      </span>
                      <Select
                        name="assetType"
                        value={journal.assetTypeId ? String(journal.assetTypeId) : ""}
                        onChange={(e) =>
                          handleUpdateJournal(
                            journal.id,
                            "assetTypeId",
                            e.target.value === "" ? null : Number(e.target.value),
                          )
                        }
                        size="sm"
                        hasError={Boolean(journalErrors.assetTypeId?.length)}
                      >
                        <option value="">選択してください</option>
                        {masters.assetTypes.map((assetType) => (
                          <option key={assetType.id} value={assetType.id}>
                            {assetType.nameJa}
                          </option>
                        ))}
                      </Select>
                      {journalErrors.assetTypeId && (
                        <p className="text-xs text-red-400">{journalErrors.assetTypeId.join("、")}</p>
                      )}
                    </div>

                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">売買記録</h3>
                        <p className="text-xs text-text-secondary md:text-sm">
                          取引ごとの理由や数量を入力して振り返りやすくします。
                        </p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleAddTrade(journal.id)}>
                        売買記録を追加
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {hasTrades ? (
                        journal.trades.map((trade) => (
                          <div key={trade.id} className="space-y-2.5">
                            <TradeForm
                              journalId={journal.id}
                              tradeData={trade}
                              onDelete={() => handleDeleteTrade(journal.id, trade.id)}
                            />
                            <ErrorMessage messages={actionError?.[trade.id]} />
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border border-dashed border-border/60 bg-base-lighter/30 px-4 py-6 text-center text-sm text-text-secondary">
                          この記録にはまだ売買記録がありません。
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Button
        onClick={addJournal}
        variant="plain"
        size="lg"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/90 text-base-darker shadow-2xl shadow-black/40 backdrop-blur-md transition-transform hover:scale-105 hover:bg-white focus-visible:ring-4 focus-visible:ring-white/80"
        aria-label="記録を追加"
      >
        <span aria-hidden="true" className="relative block h-5 w-5">
          <span className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black" />
          <span className="absolute left-1/2 top-1/2 h-[2px] w-3 -translate-x-1/2 -translate-y-1/2 bg-black" />
        </span>
      </Button>
    </section>
  );
}
