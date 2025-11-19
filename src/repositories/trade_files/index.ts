import { createTradeFile, getTradeFiles, deleteTradeFile } from "./trade_files.drizzle";
import type { TradeFileRow } from "@/types/tradeFiles";

export interface TradeFilesRepository {
  createTradeFile: (tradeFile: TradeFileRow) => Promise<{
    id?: number;
    r2Key?: string;
    errors?: {
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };
  }>;
  getTradeFiles: (tradeId: number) => Promise<{fileRows: TradeFileRow[]}>;
  deleteTradeFile: (id: number) => Promise<{ success: boolean }>;
}

export function getTradeFilesRepo(): TradeFilesRepository {
  return {  
    createTradeFile,
    getTradeFiles,
    deleteTradeFile,
  };
}