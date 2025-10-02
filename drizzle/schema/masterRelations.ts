import { relations } from "drizzle-orm";
import { accountTypes } from "./accountTypes";
import { assetTypes } from "./assetTypes";
import { journals } from "./journals";

export const accountTypeRelations = relations(accountTypes, ({ many }) => ({
  journals: many(journals),
}));

export const assetTypeRelations = relations(assetTypes, ({ many }) => ({
  journals: many(journals),
}));