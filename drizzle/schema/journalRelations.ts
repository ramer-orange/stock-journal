import { relations } from "drizzle-orm";
import { journals } from "./journals";
import { trades } from "./trades";
import { users } from "./users";
import { accountTypes } from "./accountTypes";
import { assetTypes } from "./assetTypes";

export const journalRelations = relations(journals, ({ one, many }) => ({
  user: one(users, {
    fields: [journals.userId],
    references: [users.id],
  }),
  accountType: one(accountTypes, {
    fields: [journals.accountTypeId],
    references: [accountTypes.id],
  }),
  assetType: one(assetTypes, {
    fields: [journals.assetTypeId],
    references: [assetTypes.id],
  }),
  trades: many(trades),
}));

export const tradeRelations = relations(trades, ({ one }) => ({
  journal: one(journals, {
    fields: [trades.journalId],
    references: [journals.id],
  }),
}));
