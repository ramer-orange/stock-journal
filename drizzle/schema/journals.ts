import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { accountTypes } from "./accountTypes";
import { assetTypes } from "./assetTypes";
import { index } from "drizzle-orm/sqlite-core";

/**
 * 保有銘柄(大枠)テーブル
 */
export const journals = sqliteTable("journals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountTypeId: integer("account_type_id").references(() => accountTypes.id, { onDelete: "cascade" }),
  assetTypeId: integer("asset_type_id").references(() => assetTypes.id, { onDelete: "cascade" }),
  baseCurrency: text("base_currency", { enum: ["JPY", "USD"] }).default("JPY"),
  name: text("name"),
  code: text("code"),
  displayOrder: integer("display_order").notNull().default(0),
  checked: integer("checked", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}, (table) => [
  index('journals_user_created_at_idx').on(table.userId, table.createdAt),
  uniqueIndex('journals_user_display_order_idx').on(table.userId, table.displayOrder)
]);