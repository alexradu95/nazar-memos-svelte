// src/lib/server/db/schema.ts
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

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
});

export const tags = sqliteTable('tags', {
    id: integer('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    color: text('color'),
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
});

export const memo_tags = sqliteTable('memo_tags', {
    memoId: integer('memo_id').notNull().references(() => memos.id),
    tagId: integer('tag_id').notNull().references(() => tags.id),
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.memoId, table.tagId] })
    }
});