import type { InferSelectModel } from "drizzle-orm";
import type { users, sessions, memos, tags, memo_tags, tagCategories } from "./schema";

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type Memo = InferSelectModel<typeof memos>;
export type Tag = InferSelectModel<typeof tags>;
export type MemoTag = InferSelectModel<typeof memo_tags>;
export type TagCategory = InferSelectModel<typeof tagCategories>;