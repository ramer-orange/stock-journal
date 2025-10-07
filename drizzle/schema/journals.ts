import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { accountTypes } from "./accountTypes";
import { assetTypes } from "./assetTypes";

/**
 * 保有銘柄(大枠)テーブル
 */
export const journals = sqliteTable("journals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountTypeId: integer("account_type_id").notNull().references(() => accountTypes.id, { onDelete: "cascade" }),
  assetTypeId: integer("asset_type_id").notNull().references(() => assetTypes.id, { onDelete: "cascade" }),
  baseCurrency: text("base_currency", { enum: ["JPY", "USD"] }).notNull().default("JPY"),
  name: text("name"),
  code: text("code"),
  displayOrder: integer("display_order").notNull(),
  checked: integer("checked", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});