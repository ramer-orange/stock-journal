'use client'

/**
 * TradeFormコンポーネント
 *
 * @param journalId - 親コンポーネントから渡されるjournalId
 * @param tradeData - 親コンポーネントから渡されるtradeData
 * @param onDelete - 親コンポーネントから渡されるonDelete関数
 * @returns TradeFormコンポーネント
 */

import { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
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
    console.log('changedTradeId', changedTradeId.current);
    console.log('trade', trade);
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
      console.log('result', result);
      if (!result.success) {
        setTrade(prevTrade => prevTrade.id === debouncedTrade.id ? { ...prevTrade, errors: result.errors } : prevTrade);
        setActionError(prevErrors => ({ ...prevErrors, [debouncedTrade.id]: result.errors.formErrors }));
      } else {
        setTrade(prevTrade => prevTrade.id === debouncedTrade.id ? { ...prevTrade, id: result.id } : prevTrade);
        setActionError(prevErrors => {
          const { [debouncedTrade.id]: _, ...rest } = prevErrors;
          return rest;
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

  return (
    <div>
      <p>売買記録</p>
        <form>
          <label>
            <span>売買日</span>
            <input type="date" name="tradedDate" value={trade.tradedDate ?? ""} onChange={(e) => handleChangeTradedDate(trade.id, journalId, "tradedDate", e.target.value)}/>
          </label>
          <label>
            <span>売買区分</span>
            <select name="side" id="side" value={trade.side ?? ""} onChange={(e) => handleChangeTradedDate(trade.id, journalId, "side", e.target.value)}>
              <option value="BUY">買い</option>
              <option value="SELL">売り</option>
            </select>
          </label>
          <label>
            <span>売買単価</span>
            <input type="number" name="priceValue" value={trade.priceValue ?? ""} onChange={(e) => handleChangeTradedDate(trade.id, journalId, "priceValue", e.target.value)}/>
          </label>
          <label>
            <span>数量</span>
            <input type="number" name="quantityValue" value={trade.quantityValue ?? ""} onChange={(e) => handleChangeTradedDate(trade.id, journalId, "quantityValue", e.target.value)}/>
          </label>
          <label>
            <span>売買理由</span>
            <textarea name="reason" value={trade.reason ?? ""} onChange={(e) => handleChangeTradedDate(trade.id, journalId, "reason", e.target.value)}/>
          </label>
          <label>
            <span>メモ</span>
              <textarea name="memo" value={trade.memo ?? ""} onChange={(e) => handleChangeTradedDate(trade.id, journalId, "memo", e.target.value)}/>
          </label>
          <button type="button" onClick={handleDeleteTrade}>削除</button>
          <div>{actionError?.[trade.id]?.join(", ")}</div>
        </form>
    </div>
  );
}