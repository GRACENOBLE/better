"use client";

import { useChat } from "@ai-sdk/react";
import { ReactFlowProvider } from "@xyflow/react";
import RoadmapRenderer from "@/components/roadmap-renderer";
import { useState } from "react";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "../ui/button";
import { CornerRightUp } from "lucide-react";
import Markdown from "markdown-to-jsx";

export default function Chat() {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
    onResponse: () => setIsThinking(true),
    onFinish: () => setIsThinking(false),
    onError: () => setIsThinking(false),
  });

  const chatRef = useChatScroll(messages);
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
      <div className="flex flex-col w-full pt-10 pb-24 ps-4  max-w-2xl  mx-auto">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">
              👋 Welcome! I can create interactive roadmaps for you.
            </div>
            <div className="text-sm space-y-1">
              <div>Try asking:</div>
              <div className="font-medium">
                "Generate a roadmap for learning React"
              </div>
              <div className="font-medium">
                "Create a roadmap for starting a tech startup"
              </div>
              <div className="font-medium">
                "Show me a data science learning path"
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            className={` flex pb-8 ${
              message.role === "user" ? "justify-end" : ""
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
          <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[95%]">
            <div className="font-semibold mb-2">🤖 AI Assistant</div>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Creating your roadmap...</span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full left-1/2 -translate-x-1/2 absolute flex justify-center bottom-0 bg-linear-to-t from-muted via-muted/80 to-transparent py-6"
      >
        <div className="w-full max-w-2xl relative ">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="What are you planning?"
            className="dark:bg-zinc-900 bottom-0 max-w-2xl p-2 h-12 w-full pl-4 focus:outline-none placeholder:text-base border rounded-sm bg-white"
            disabled={isThinking}
          />
          <Button
            type="submit"
            size={"icon"}
            disabled={isThinking}
            className="absolute right-2 top-[50%] -translate-y-[50%] "
          >
            <CornerRightUp size={16} />
          </Button>
        </div>
      </form>

      <div className="mt-2 text-sm text-gray-500 text-center">
        Examples: "React learning path", "Data science roadmap", "Startup launch
        plan", "Python mastery guide"
      </div>
    </div>
  );
}
