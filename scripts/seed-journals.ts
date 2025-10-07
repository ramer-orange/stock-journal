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
  const accountTypeId = 1;
  const assetTypeId = 1;

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
    .values({
      id: accountTypeId,
      code: "TAXABLE",
      nameJa: "特定",
    })
    .onConflictDoNothing();

  await db
    .insert(assetTypes)
    .values({
      id: assetTypeId,
      code: "STOCK",
      nameJa: "株",
    })
    .onConflictDoNothing();

  await db.insert(journals).values([
    {
      userId: testUserId,
      accountTypeId,
      assetTypeId,
      baseCurrency: "JPY",
      name: "メタプラ",
      code: "3350",
      displayOrder: 1,
      checked: true,
    },
    {
      userId: testUserId,
      accountTypeId,
      assetTypeId,
      baseCurrency: "USD",
      name: "NVIDIA",
      code: "NVDA",
      displayOrder: 2,
      checked: false,
    },
  ]);

  console.log("Seeded journals test data.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
