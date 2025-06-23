"use server";

import { db } from "@/lib/db";
import { message, messagePart } from "@/lib/db/schemas/chat";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const submitToChatPage = async (formdata: FormData) => {
  const starter = formdata.get("starter")?.toString();
  const params = new URLSearchParams({ starter: starter ?? "" }).toString();
  redirect(`/chat/new?${params}`);
};

export const updateConversation = async ({
  conversationId,
  messages,
}: {
  conversationId: string;
  messages: {
    id: string;
    role: "user" | "assistant";
    content: string;
    parts?: {
      type: "tool-invocation";
      toolName: string;
      state: "call" | "result";
      args?: any;
      result?: any;
    }[];
  }[];
}) => {
  try {
    for (const msg of messages) {
      // Upsert message
      await db
        .insert(message)
        .values({
          id: msg.id,
          conversationId,
          role: msg.role,
          content: msg.content,
        })
        .onConflictDoUpdate({
          target: message.id,
          set: {
            content: msg.content,
            role: msg.role,
          },
        });

      // Optional: delete existing parts first (simpler than syncing diffs)
      await db.delete(messagePart).where(eq(messagePart.messageId, msg.id));

      if (msg.parts && msg.parts.length > 0) {
        await db.insert(messagePart).values(
          msg.parts.map((part) => ({
            messageId: msg.id,
            type: part.type,
            toolName: part.toolName,
            state: part.state,
            args: part.args,
            result: part.result,
          }))
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};
