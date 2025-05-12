"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full  py-24 stretch overflow-auto">
      {messages.map((message, index) => (
        <div key={message.id + index} className="whitespace-pre-wrap">
          {/* {message.role === "user" ? "User: " : "AI: "} */}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    className={cn("flex pb-8", {
                      " justify-end": message.role === "user",
                    })}
                  >
                    <div
                      className={cn("border rounded-md  max-w-96 px-4 py-2", {
                        "bg-muted": message.role === "user",
                      })}
                      key={`${message.id}-${i}`}
                    >
                      {part.text}
                    </div>
                  </div>
                );
            }
          })}
        </div>
      ))}
      <div className="fixed bottom-0 left-0 flex justify-center bg-gradient-to-t from-muted via-muted to-transparent w-full">
        <form onSubmit={handleSubmit} className="min-w-2xl bg-muted my-8">
          <input
            className=" dark:bg-zinc-900 bottom-0 w-full  p-2  border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Lets talk about a better you..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
