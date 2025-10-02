import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { journals } from "./journals";

// 取引テーブル
export const trades = sqliteTable("trades", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  journalId: integer("journal_id").notNull().references(() => journals.id, { onDelete: "cascade" }),
  side: text("side", { enum: ["BUY", "SELL"] }).notNull(),
  priceValue: integer("price_value"),
  priceScale: integer("price_scale"),
  quantityValue: integer("quantity_value"),
  quantityScale: integer("quantity_scale"),
  tradedDate: integer("traded_date", { mode: "timestamp_ms" }),
  reason: text("reason"),
  memo: text("memo"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});
