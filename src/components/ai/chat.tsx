"use client";

import { useChat } from "@ai-sdk/react";
import { ReactFlowProvider } from "@xyflow/react";
import RoadmapRenderer from "@/components/roadmap-renderer";
import { useState } from "react";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "../ui/button";
import { CornerRightUp } from "lucide-react";
import Markdown from "markdown-to-jsx";
import Loader from "./loader";

import { useRef } from "react";

export default function Chat() {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const { messages, input, setInput, handleInputChange, handleSubmit } =
    useChat({
      maxSteps: 3,
      onResponse: () => setIsThinking(true),
      onFinish: () => setIsThinking(false),
      onError: () => setIsThinking(false),
    });

  const chatRef = useChatScroll(messages);
  const formRef = useRef<HTMLFormElement>(null);
  const bolds = ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => <p {...props}>{children}</p>;

  return (
    <div
      className="h-full overflow-auto transition-all ease-in-out duration-500"
      ref={chatRef}
    >
      <div className="flex flex-col w-full pt-10 pb-16  max-w-2xl  mx-auto  min-h-full">
        {messages.length === 0 && (
          <div className="text-center py-8   h-full my-auto">
            <div className="text-4xl font-title font-semibold mb-6">Better</div>
            <div className="text-muted-foreground/80 font-title mb-6">
              I can generate visual roadmaps to help you learn new skills, plan
              your career, or master any topic with a step-by-step plan.
            </div>
            <div className="text-xs flex justify-center text-muted-foreground gap-2">
              {["React roadmap", "Tech startup roadmap", "Data science"].map(
                (item, idx) => (
                  <button
                    key={idx}
                    className="font-medium border px-2 py-1 rounded-sm bg-muted hover:cursor-pointer"
                    type="button"
                    onClick={() => {
                      setInput(item);
                      setIsThinking(true);
                      setTimeout(() => {
                        formRef.current?.requestSubmit();
                      }, 0);
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            className={` flex pb-8 ${
              message.role === "user" ? "justify-end" : "ps-4"
            }`}
          >
            <div
              key={message.id}
              className={`rounded-md   py-2 ${
                message.role === "user" ? "bg-muted border max-w-96 px-4" : ""
              }`}
            >
              {message.content && (
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
                  {message.content}
                </Markdown>
              )}

              {message.parts.map((part, partIndex) => {
                switch (part.type) {
                  case "tool-invocation":
                    const toolInvocation = part.toolInvocation;

                    if (
                      toolInvocation.toolName === "generateRoadmap" &&
                      toolInvocation.state === "result"
                    ) {
                      return (
                        <div key={partIndex} className="mt-4">
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h3 className="font-semibold mb-3 text-lg flex items-center">
                              🗺️ Generated Roadmap:{" "}
                              {toolInvocation.result.metadata?.topic}
                            </h3>
                            <div className="h-96 border rounded-lg overflow-hidden">
                              <ReactFlowProvider>
                                <RoadmapRenderer
                                  roadmapData={toolInvocation.result}
                                />
                              </ReactFlowProvider>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              💡 Tip: You can drag nodes around, zoom in/out,
                              and explore the roadmap above
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Show loading state for tool calls
                    if (
                      toolInvocation.toolName === "generateRoadmap" &&
                      toolInvocation.state === "call"
                    ) {
                      return (
                        <div
                          key={partIndex}
                          className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-blue-700">
                              Generating roadmap for:{" "}
                              {toolInvocation.args.topic}...
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return null;

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="ps-4">
            <Loader />
          </div>
        )}
        <form
          ref={formRef}
          onSubmit={(e) => {
            setIsThinking(true);
            handleSubmit(e);
          }}
          className="w-full left-1/2 -translate-x-1/2 absolute flex justify-center bottom-0 bg-linear-to-t from-muted via-muted/80 to-transparent py-6"
        >
          <div className="w-full max-w-2xl relative ">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="What are you planning?"
              className="dark:bg-zinc-900 bottom-0 max-w-2xl max-h-[192px] min-h-[44px] h-full field-sizing-content w-full pl-4 focus:outline-none placeholder:text-base  rounded-sm bg-white border resize-none pt-3 pe-14"
              disabled={isThinking}
            />
            <Button
              type="submit"
              size={"icon"}
              disabled={isThinking}
              className="absolute right-2 bottom-2"
            >
              <CornerRightUp size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
