import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import * as schema from '@/db/schema';

const DATA_DIR = path.resolve(process.cwd(), 'data');
mkdirSync(DATA_DIR, { recursive: true });

const DB_FILE =
  process.env.NODE_ENV === 'production'
    ? path.join(DATA_DIR, 'site.db')
    : path.join(DATA_DIR, 'dev.db');

// Cache the connection on globalThis so HMR in dev doesn't open a new SQLite
// handle on every reload — that would either leak fds or fight a journal lock.
const globalForDb = globalThis as unknown as {
  __renoxium_db?: Database.Database;
};

const sqlite =
  globalForDb.__renoxium_db ??
  (() => {
    const conn = new Database(DB_FILE);
    conn.pragma('journal_mode = WAL');
    conn.pragma('foreign_keys = ON');
    return conn;
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__renoxium_db = sqlite;
}

export const db = drizzle(sqlite, { schema });
export { schema };
