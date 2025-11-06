'use client'

/**
 * TradeFormコンポーネント
 *
 * @param journalId - 親コンポーネントから渡されるjournalId
 * @param tradeData - 親コンポーネントから渡されるtradeData
 * @param onDelete - 親コンポーネントから渡されるonDelete関数
 * @returns TradeFormコンポーネント
 */

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { upsertTradeAction } from "@/app/(main)/journals/_actions/tradeActions";
import { TradeClient } from "@/types/trades";

type Props = {
  journalId: number;
  tradeData: TradeClient;
  onDelete?: () => void;
};

export default function TradeForm({ journalId, tradeData, onDelete }: Props) {
  const [trade, setTrade] = useState<TradeClient>(tradeData);
  const changedTradeId = useRef(0);
  const isFirstRender = useRef(true);
  const [actionError, setActionError] = useState<Record<number, string[]>>({}); //フォーム全体に関わるエラーステート


  // trade upsert処理
  const handleChangeTradedDate = (id: number, journalId: number, field: string, value: string | number | boolean | null) => {
    setTrade({ ...trade, [field]: value });
    changedTradeId.current = id;
  }
  // デバウンス処理で保存
  const [debouncedTrade] = useDebounce(
    trade.id === changedTradeId.current ? trade : undefined,
    500
  );
  useEffect(() => {
    // 初回レンダリング時は保存処理は行わない
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // undefinedの場合は保存しない
    if(!debouncedTrade) {
      return;
    }

    const saveTrade = async () => {
      const result = await upsertTradeAction(debouncedTrade);
      if (!result.success) {
        setTrade(prevTrade => prevTrade.id === debouncedTrade.id ? { ...prevTrade, errors: result.errors } : prevTrade);
        setActionError(prevErrors => ({ ...prevErrors, [debouncedTrade.id]: result.errors.formErrors }));
      } else {
        setTrade(prevTrade => prevTrade.id === debouncedTrade.id ? { ...prevTrade, id: result.id } : prevTrade);
        setActionError(prevErrors => {
          const nextErrors = { ...prevErrors };
          delete nextErrors[debouncedTrade.id];
          return nextErrors;
        });
      }

      // 変更したTradeIDをリセット
      changedTradeId.current = 0;
  }
  saveTrade();
  }, [debouncedTrade]);


  // 削除処理
  const handleDeleteTrade = async () => {
    // 親コンポーネントの関数を呼び出す（親が削除処理を担当）
    if (onDelete) {
      onDelete();
    }
  }

  const tradeFieldErrors = trade.errors ?? {};
  const sideLabel = trade.side === "SELL" ? "売り" : "買い";
  const sideBadgeVariant = trade.side === "SELL" ? "danger" : "success";
  const tradedDateValue = trade.tradedDate ?? "";

  return (
    <section className="flex flex-col gap-2.5 rounded-lg border border-border bg-base-darker/60 p-3 shadow-md shadow-black/10 md:p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={sideBadgeVariant}>{sideLabel}</Badge>
          <span className="text-xs text-text-secondary md:text-sm">
            {tradedDateValue ? `取引日: ${tradedDateValue}` : "取引日が未設定です"}
          </span>
        </div>
        <Button variant="danger" size="sm" onClick={handleDeleteTrade}>
          記録を削除
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            売買日
          </span>
          <Input
            type="date"
            name="tradedDate"
            value={tradedDateValue}
            size="sm"
            onChange={(e) => handleChangeTradedDate(trade.id, journalId, "tradedDate", e.target.value)}
            hasError={Boolean(tradeFieldErrors.tradedDate?.length)}
          />
          {tradeFieldErrors.tradedDate && (
            <p className="text-xs text-red-400">{tradeFieldErrors.tradedDate.join("、")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            売買区分
          </span>
          <Select
            name="side"
            value={trade.side ?? "BUY"}
            size="sm"
            onChange={(e) => handleChangeTradedDate(trade.id, journalId, "side", e.target.value)}
            hasError={Boolean(tradeFieldErrors.side?.length)}
          >
            <option value="BUY">買い</option>
            <option value="SELL">売り</option>
          </Select>
          {tradeFieldErrors.side && (
            <p className="text-xs text-red-400">{tradeFieldErrors.side.join("、")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            売買単価
          </span>
          <Input
            type="number"
            name="priceValue"
            value={trade.priceValue ?? ""}
            onChange={(e) => handleChangeTradedDate(trade.id, journalId, "priceValue", e.target.value)}
            inputMode="decimal"
            placeholder="例: 1540.5"
            size="sm"
            hasError={Boolean(tradeFieldErrors.priceValue?.length)}
          />
          {tradeFieldErrors.priceValue && (
            <p className="text-xs text-red-400">{tradeFieldErrors.priceValue.join("、")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            数量
          </span>
          <Input
            type="number"
            name="quantityValue"
            value={trade.quantityValue ?? ""}
            onChange={(e) => handleChangeTradedDate(trade.id, journalId, "quantityValue", e.target.value)}
            inputMode="decimal"
            placeholder="例: 100"
            size="sm"
            hasError={Boolean(tradeFieldErrors.quantityValue?.length)}
          />
          {tradeFieldErrors.quantityValue && (
            <p className="text-xs text-red-400">{tradeFieldErrors.quantityValue.join("、")}</p>
          )}
        </div>

        <div className="col-span-2 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              売買理由
            </span>
            <Textarea
              name="reason"
              value={trade.reason ?? ""}
              onChange={(e) => handleChangeTradedDate(trade.id, journalId, "reason", e.target.value)}
              placeholder="エントリー／イグジットの根拠を記録"
              rows={2}
              size="sm"
              className="min-h-[72px]"
              hasError={Boolean(tradeFieldErrors.reason?.length)}
            />
            {tradeFieldErrors.reason && (
              <p className="text-xs text-red-400">{tradeFieldErrors.reason.join("、")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              メモ
            </span>
            <Textarea
              name="memo"
              value={trade.memo ?? ""}
              onChange={(e) => handleChangeTradedDate(trade.id, journalId, "memo", e.target.value)}
              placeholder="次回に活かしたい学びや市場の状況"
              rows={2}
              size="sm"
              className="min-h-[72px]"
              hasError={Boolean(tradeFieldErrors.memo?.length)}
            />
            {tradeFieldErrors.memo && (
              <p className="text-xs text-red-400">{tradeFieldErrors.memo.join("、")}</p>
            )}
          </div>
        </div>
      </div>

      <ErrorMessage messages={actionError?.[trade.id]} className="mt-1" />
    </section>
  );
}