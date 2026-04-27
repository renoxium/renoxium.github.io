import { defineConfig } from 'drizzle-kit';

// Schema lives in db/schema.ts (defined in Phase 2).
// Migrations land in drizzle/. SQLite file lives at data/dev.db locally,
// data/site.db in production (see lib/db.ts).
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.NODE_ENV === 'production'
      ? './data/site.db'
      : './data/dev.db',
  },
});
