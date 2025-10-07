import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/drizzle/schema';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface Env {
  stock_journal_db: D1Database;
}

/**
 * データベース接続
 * @returns D1Database
 */
export function connectDb() {
  const { env } = getCloudflareContext()
  return drizzle(env.stock_journal_db, { schema });
}