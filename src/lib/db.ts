import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/drizzle/schema';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// データベース接続
export interface Env {
  stock_journal_db: D1Database;
}

export function getDb() {
  const { env } = getCloudflareContext()
  return drizzle(env.stock_journal_db, { schema });
}