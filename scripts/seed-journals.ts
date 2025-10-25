import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import config from "../drizzle.config.local";
import * as schema from "../drizzle/schema";
import { accountTypes } from "../drizzle/schema/accountTypes";
import { assetTypes } from "../drizzle/schema/assetTypes";
import { journals } from "../drizzle/schema/journals";
import { users } from "../drizzle/schema/users";

const main = async () => {
  const dbPath = config.dbCredentials.url;

  if (!dbPath) {
    throw new Error("Missing local D1 database url in drizzle.config.local.ts");
  }

  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite, { schema });

  const testUserId = "3787e5c6-8377-491f-b253-2377b4db2680";

  await db
    .insert(users)
    .values({
      id: testUserId,
      name: "Demo User",
      email: "demo@example.com",
    })
    .onConflictDoNothing();

  await db
    .insert(accountTypes)
    .values([
      {
        id: 1,
        code: "TOKUTEI",
        nameJa: "特定",
      },
      {
        id: 2,
        code: "NISA",
        nameJa: "NISA",
      }
    ])
    .onConflictDoNothing();

  await db
    .insert(assetTypes)
    .values([
      {
        id: 1,
        code: "STOCK",
        nameJa: "株",
      },
      {
        id: 2,
        code: "FUND",
        nameJa: "投信",
      },
      {
        id: 3,
        code: "ETF",
        nameJa: "ETF",
      }
    ])
    .onConflictDoNothing();

  await db.insert(journals).values([
    {
      userId: testUserId,
      accountTypeId: 1,
      assetTypeId: 1,
      baseCurrency: "JPY",
      name: "メタプラ",
      code: "3350",
      displayOrder: 1,
      checked: true,
    },
    {
      userId: testUserId,
      accountTypeId: 2,
      assetTypeId: 2,
      baseCurrency: "USD",
      name: "NVIDIA",
      code: "NVDA",
      displayOrder: 2,
      checked: false,
    },
  ]);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
