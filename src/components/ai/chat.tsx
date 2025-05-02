"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
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
                      className={cn("border rounded-md max-w-96 px-4 py-2", {
                        "": message.role === "user",
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

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
