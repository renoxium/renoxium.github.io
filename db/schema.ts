import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tables here are designed to mirror what the static JSX arrays held in Phase 1
// (craft_items, faq_items, edge_rows) plus the dynamic surfaces that Phase 3
// will wire up (inquiries, page_views).
//
// JSON columns store arrays/objects as TEXT — drizzle handles serialization via
// the .$type<>() typed helpers below.

export const inquiries = sqliteTable('inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull().default(''),
  // Selected service chips, e.g. ["SaaS", "AI product"]
  servicesJson: text('services_json', { mode: 'json' })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  budget: text('budget'),
  // Pipeline state. New on insert, advances via /admin in Phase 3.
  status: text('status', { enum: ['new', 'contacted', 'qualified', 'won', 'lost'] })
    .notNull()
    .default('new'),
  notes: text('notes').notNull().default(''),
  followUpAt: integer('follow_up_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const craftItems = sqliteTable('craft_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ord: integer('ord').notNull(),
  number: text('number').notNull(), // "01" .. "06" — matches the JSX `n` field
  title: text('title').notNull(),
  meta: text('meta').notNull(),
  // Identifies which animated SVG illustration to render (saas|ai|web|mobile|proto|az)
  scene: text('scene').notNull(),
  body: text('body').notNull(),
  bullets: text('bullets', { mode: 'json' }).$type<string[]>().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const faqItems = sqliteTable('faq_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ord: integer('ord').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const edgeRows = sqliteTable('edge_rows', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ord: integer('ord').notNull(),
  dimension: text('dimension').notNull(),
  us: text('us').notNull(),
  them: text('them').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const pageViews = sqliteTable('page_views', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull(),
  referer: text('referer'),
  userAgent: text('user_agent'),
  country: text('country'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Inferred types for use across the app.
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type CraftItem = typeof craftItems.$inferSelect;
export type FaqItem = typeof faqItems.$inferSelect;
export type EdgeRow = typeof edgeRows.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
