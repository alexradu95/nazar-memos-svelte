// src/lib/db/schema.ts
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  settingsJson: text('settings_json'),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`)
});

export const memos = sqliteTable('memos', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title'),
  content: text('content').notNull(),
  visibility: text('visibility').notNull().default('private'),
  pinned: integer('pinned').notNull().default(0),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s', 'now'))`)
}, (table) => [
  index('idx_memos_user_id').on(table.userId),
  index('idx_memos_created_at').on(table.createdAt)
]);

export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey(),
  memoId: integer('memo_id').notNull().references(() => memos.id),
  filename: text('filename').notNull(),
  filePath: text('file_path').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`)
}, (table) => [
  index('idx_resources_memo_id').on(table.memoId)
]);

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  color: text('color')
}, (table) => [
  primaryKey({ columns: [table.userId, table.name] })
]);

export const memoTags = sqliteTable('memo_tags', {
  memoId: integer('memo_id').notNull().references(() => memos.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`)
}, (table) => [
  primaryKey({ columns: [table.memoId, table.tagId] }),
  index('idx_memo_tags_tag_id').on(table.tagId)
]);

export const aiInteractions = sqliteTable('ai_interactions', {
  id: integer('id').primaryKey(),
  memoId: integer('memo_id').notNull().references(() => memos.id),
  agentType: text('agent_type').notNull(),
  query: text('query').notNull(),
  response: text('response').notNull(),
  contextJson: text('context_json'),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`)
}, (table) => [
  index('idx_ai_interactions_memo_id').on(table.memoId)
]);

export const aiFollowups = sqliteTable('ai_followups', {
  id: integer('id').primaryKey(),
  interactionId: integer('interaction_id').notNull().references(() => aiInteractions.id),
  question: text('question').notNull(),
  response: text('response').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`)
}, (table) => [
  index('idx_ai_followups_interaction_id').on(table.interactionId)
]);