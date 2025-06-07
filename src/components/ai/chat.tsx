"use client";

import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // @ts-ignore
  const bolds = ({ children, ...props }) => <p {...props}>{children}</p>;
  // @ts-ignore
  const listItems = ({ children, ...props }) => (
    <div {...props}>{children}</div>
  );

  return (
    <div className="flex flex-col w-full  py-24  overflow-auto">
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
                      className={cn(" rounded-md   px-4 py-2", {
                        "bg-muted border max-w-96": message.role === "user",
                      })}
                      key={`${message.id}-${i}`}
                    >
                      <Markdown
                        options={{
                          overrides: {
                            p: {
                              props: {
                                className:
                                  "mb-4 text-base leading-relaxed text-gray-800",
                              },
                            },
                            h1: {
                              props: {
                                className: "text-3xl font-bold mt-6 mb-4",
                              },
                            },
                            h2: {
                              props: {
                                className: "text-2xl font-semibold mt-5 mb-3",
                              },
                            },
                            h3: {
                              props: {
                                className: "text-xl font-medium mt-4 mb-2",
                              },
                            },
                            ul: {
                              props: {
                                className: "list-disc pl-5 mb-4",
                              },
                            },
                            ol: {
                              props: {
                                className: "list-decimal pl-5 mb-4",
                              },
                            },
                            li: {
                              props: {
                                className: "mb-8",
                              },
                            },
                            a: {
                              props: {
                                className: "text-blue-600 hover:underline",
                                target: "_blank",
                                rel: "noopener noreferrer",
                              },
                            },
                            blockquote: {
                              props: {
                                className:
                                  "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
                              },
                            },
                            strong: {
                              component: bolds, // Your custom component
                              props: {
                                className: "font-semibold",
                              },
                            },
                            code: {
                              props: {
                                className:
                                  "bg-gray-100 px-1 py-0.5 rounded font-mono text-sm",
                              },
                            },
                            pre: {
                              props: {
                                className:
                                  "bg-gray-100 p-4 rounded overflow-x-auto text-sm my-4",
                              },
                            },
                          },
                        }}
                      >
                        {part.text}
                      </Markdown>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      ))}
      <div className="fixed bottom-0 left-0 flex justify-center bg-gradient-to-t from-muted via-muted to-transparent w-full">
        <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-4 bg-muted my-8">
          <input
            className=" dark:bg-zinc-900 bottom-0 w-full  p-2  border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="What are you planning?"
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
