import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

import { user } from "./auth";  // adjust this import based on your file structure

export const conversation = pgTable("conversation", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const message = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content"), // main markdown body
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messagePart = pgTable("message_part", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .notNull()
    .references(() => message.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'tool-invocation'
  toolName: text("tool_name"), // e.g. 'generateRoadmap'
  state: text("state"), // 'call' | 'result'
  args: jsonb("args"),
  result: jsonb("result"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatSchema = {
  conversation,
  message,
  messagePart,
};
