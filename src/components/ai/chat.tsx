"use client";

import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Button } from "../ui/button";
import { CornerRightUp, Divide } from "lucide-react";
import { useState } from "react";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import Loader from "./loader";

export default function Chat() {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onResponse: () => setIsThinking(true),
    onFinish: () => setIsThinking(false),
    onError: () => setIsThinking(false),
  });
  const chatRef = useChatScroll(messages);

  // @ts-ignore
  const bolds = ({ children, ...props }) => <p {...props}>{children}</p>;

  return (
    <div className="h-full overflow-auto transition-all ease-in-out duration-500" ref={chatRef}>
      <div className="flex flex-col w-full pt-10 pb-24 ps-4  max-w-2xl  mx-auto">
        {messages.map((message, index) => (
          <div key={message.id + index} className="whitespace-pre-wrap">
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <div
                      key={i}
                      className={cn("flex pb-8", {
                        " justify-end": message.role === "user",
                      })}
                    >
                      <div
                        className={cn(" rounded-md   py-2", {
                          "bg-muted border max-w-96 px-4": message.role === "user",
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
        { isThinking && <div className="flex gap-1 items-center">Thinking<Loader className="translate-y-1"/></div>}
        
        {/* <div className="fixed bottom-0 left-0 flex justify-center bg-gradient-to-t from-muted via-muted to-transparent w-full"> */}

        {/* </div> */}
      </div>
      <form
        onSubmit={(e) => {
          setIsThinking(true);
          handleSubmit(e);
        }}
        className="w-full left-1/2 -translate-x-1/2 absolute flex justify-center bottom-0 bg-linear-to-t from-muted via-muted/80 to-transparent py-6"
      >
        <div className="w-full max-w-2xl relative ">
          <input
            className=" dark:bg-zinc-900 bottom-0 max-w-2xl p-2 h-12 w-full pl-4 focus:outline-none placeholder:text-base border rounded-sm bg-white"
            value={input}
            placeholder="What are you planning?"
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            size={"icon"}
            className="absolute right-2 top-[50%] -translate-y-[50%] "
          >
            <CornerRightUp size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
