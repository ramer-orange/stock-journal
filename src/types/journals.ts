import type { journals } from "@/drizzle/schema/journals";
import type { AccountTypeRow } from "@/types/accountTypes";
import type { AssetTypeRow } from "@/types/assetTypes";

export type JournalRow = typeof journals.$inferSelect;

export type JournalWithRelations =
  JournalRow & {
    accountType: AccountTypeRow;
    assetType: AssetTypeRow;
  };