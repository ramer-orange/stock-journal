import type { accountTypes } from "@/drizzle/schema/accountTypes";

export type AccountType = typeof accountTypes.$inferSelect;