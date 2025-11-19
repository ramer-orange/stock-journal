import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { trades } from "./trades";
import { index } from "drizzle-orm/sqlite-core";

// 取引ファイルテーブル
export const tradeFiles = sqliteTable("trade_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tradeId: integer("trade_id").notNull().references(() => trades.id, { onDelete: "cascade" }),
  r2Key: text("r2_key").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
}, (table) => [
  index('trade_files_trade_id_idx').on(table.tradeId),
]);