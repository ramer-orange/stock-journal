import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 資産種別マスターテーブル
export const assetTypes = sqliteTable("asset_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  nameJa: text("name_ja").notNull(),
});