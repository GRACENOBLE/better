import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { message } from "@/lib/db/schemas/chat";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cid = url.searchParams.get("conversationId");
  if (!cid) {
    return NextResponse.json(
      { error: "Missing conversationId" },
      { status: 400 }
    );
  }

  const msgs = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, cid))
    .orderBy(desc(message.createdAt));

  return NextResponse.json({ messages: msgs.reverse() });
}
