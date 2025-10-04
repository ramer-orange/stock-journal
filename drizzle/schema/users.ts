import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

// ユーザーテーブル
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: text("emailVerified"),
  image: text("image"),
  planCode: text("plan_code", { enum: ["FREE", "PLUS"] }).notNull().default("FREE"),
  status: text("status", { enum: ["ACTIVE", "DELETED"] }).notNull().default("ACTIVE"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
});