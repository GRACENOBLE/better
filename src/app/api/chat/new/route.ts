
import { db } from "@/lib/db";
import { conversation } from "@/lib/db/schemas/chat";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const { userId, firstMessage } = await req.json();
  if (!userId || !firstMessage) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const obj = await generateObject({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: `Write a concise 3–6 word chat title summarizing this user message:\n"${firstMessage}"`,
    schema: z.object({ title: z.string() }),
  });

  const title = obj.object.title.trim()

  const [result] = await db
    .insert(conversation)
    .values({ userId, title })
    .returning({ id: conversation.id });

  return NextResponse.json({ conversationId: result.id });
}
