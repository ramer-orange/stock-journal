import { upsertTrade, deleteTrade } from "./trades.drizzle";
import { TradeRow } from "@/types/trades";

export interface TradesRepository {
  upsertTrade: (tradeData: TradeRow) => Promise<{
    id?: number;
    errors?: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };
  }>;
  deleteTrade: (tradeId: number) => Promise<{
    success?: boolean;
    errors?: {
      formErrors: string[];
    };
  }>;
}

export function getTradesRepo(): TradesRepository {
  return {
    upsertTrade,
    deleteTrade,
  };
}