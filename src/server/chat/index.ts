"use server";

import { redirect } from "next/navigation";

export const submitToChatPage = async (formdata: FormData) => {
  const starter = formdata.get("starter")?.toString();
  const params = new URLSearchParams({ starter: starter ?? "" }).toString();
  redirect(`/chat/new?${params}`);
};
