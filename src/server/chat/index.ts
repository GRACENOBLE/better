"use server";

import { redirect } from "next/navigation";

export const submitToChatPage = async (formdata: FormData) => {
  const starter = formdata.get("chatStarter")?.toString();
  const params = new URLSearchParams({ chatStarter: starter ?? "" }).toString();
  redirect(`/chat/new?${params}`);
};
