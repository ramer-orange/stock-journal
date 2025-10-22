import type { assetTypes } from "@/drizzle/schema/assetTypes";

export type AssetType = typeof assetTypes.$inferSelect;