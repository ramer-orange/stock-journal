import type { accountTypes } from "@/drizzle/schema/accountTypes";

export type AccountTypeRow = typeof accountTypes.$inferSelect;