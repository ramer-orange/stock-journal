import type { assetTypes } from "@/drizzle/schema/assetTypes";

export type AssetTypeRow = typeof assetTypes.$inferSelect;