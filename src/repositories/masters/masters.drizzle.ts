import { getRepoContext } from "@/lib/server/getRepoContext";

export const getMasters = async () => {
  const { db } = await getRepoContext();

  const accountTypes = await db.query.accountTypes.findMany();
  const assetTypes = await db.query.assetTypes.findMany();

  return {
    accountTypes: accountTypes,
    assetTypes: assetTypes,
  };
}