import { upsertTrade, deleteTrade, upsertTradeWithJournal } from "./trades.drizzle";
import { TradeRow } from "@/types/trades";
import { JournalRow } from "@/types/journals";

export interface TradesRepository {
  upsertTrade: (tradeData: TradeRow) => Promise<{
    id?: number;
    errors?: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };
  }>;
  upsertTradeWithJournal: (validatedJournalData: JournalRow, validatedTradeData: TradeRow) => Promise<{
    journalId?: number;
    tradeId?: number;
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
    upsertTradeWithJournal,
    deleteTrade,
  };
}