export interface Journal {
  id: number;
  userId: string;
  accountTypeId: number;
  assetTypeId: number;
  baseCurrency: "JPY" | "USD";
  name: string | null;
  code: string | null;
  displayOrder: number;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}