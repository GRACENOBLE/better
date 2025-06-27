

import { db } from "@/lib/db";
import { message } from "@/lib/db/schemas/chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { conversationId, role, content } = body;

  if (!conversationId || !role || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await db.insert(message).values({
      conversationId,
      role,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to insert message:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
