import type { trades } from "@/drizzle/schema/trades";

export type TradeRow = typeof trades.$inferSelect;

export type TradeClient =
  TradeRow & {
    errors?: Record<string, string[]>;
  };