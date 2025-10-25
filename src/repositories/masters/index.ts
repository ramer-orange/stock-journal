import { AccountType } from "@/types/accountTypes";
import { AssetType } from "@/types/assetTypes";
import { getMasters } from "./masters.drizzle";

// マスターデータの取得のリポジトリ
export interface MastersRepository {
  getMasters: () => Promise<{
    accountTypes: AccountType[];
    assetTypes: AssetType[];
  }>;
}

export function getMastersRepo(): MastersRepository {
  return {
    getMasters,
  };
}