import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import localConfig from "../drizzle.config.local";
import * as schema from "../drizzle/schema";
import { accountTypes } from "../drizzle/schema/accountTypes";
import { assetTypes } from "../drizzle/schema/assetTypes";

const accountTypeSeeds = [
  { id: 1, code: "TOKUTEI", nameJa: "特定" },
  { id: 2, code: "NISA", nameJa: "NISA" },
];

const assetTypeSeeds = [
  { id: 1, code: "STOCK", nameJa: "株" },
  { id: 2, code: "FUND", nameJa: "投信" },
  { id: 3, code: "OTHER", nameJa: "その他" },
];

async function main() {
  const dbPath = localConfig.dbCredentials.url;

  if (!dbPath) {
    throw new Error(
      "Missing local D1 database url in drizzle.config.local.ts. Please run `npx wrangler d1 info` to confirm the path."
    );
  }

  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite, { schema });

  await db
    .insert(accountTypes)
    .values(accountTypeSeeds)
    .onConflictDoNothing();

  await db
    .insert(assetTypes)
    .values(assetTypeSeeds)
    .onConflictDoNothing();

  console.log("Seeded account_types and asset_types");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
