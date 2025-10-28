import type { journals } from "@/drizzle/schema/journals";
import type { AccountType } from "@/types/accountTypes";
import type { AssetType } from "@/types/assetTypes";
import type { TradeRow } from "@/types/trades";

export type JournalRow = typeof journals.$inferSelect;

export type JournalWithRelations =
  JournalRow & {
    accountType: AccountType;
    assetType: AssetType;
    trades: TradeRow[];
  };

export type JournalClient =
  JournalWithRelations & {
    errors?: Record<string, string[]>;
  };