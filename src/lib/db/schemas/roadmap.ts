import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const roadmap = pgTable("roadmap", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges").notNull(),
  metadata: jsonb("metadata"),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
