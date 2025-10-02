import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 口座種別マスターテーブル
export const accountTypes = sqliteTable("account_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  nameJa: text("name_ja").notNull(),
});