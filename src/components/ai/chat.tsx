"use client";

import { Message, useChat } from "@ai-sdk/react";
import { ReactFlowProvider } from "@xyflow/react";
import RoadmapRenderer from "@/components/roadmap-renderer";
import { useState } from "react";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "../ui/button";
import { CornerRightUp, LoaderCircle, Pencil } from "lucide-react";
import Markdown from "markdown-to-jsx";
import Loader from "./loader";
import { useRef } from "react";
import { AnimatedGroup } from "../ui/animated-group";
import { TextEffect } from "../ui/text-effect";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BiExpandAlt } from "react-icons/bi";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { authClient } from "@/lib/auth/auth-client";

export default function Chat({ chatId }: { chatId: string }) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const user = session?.user;
  console.log("user: ", user);

  const userId = user?.id;
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat({
    maxSteps: 3,
    onResponse: () => setIsThinking(true),
    onFinish: () => setIsThinking(false),
    onError: () => setIsThinking(false),
  });

  console.log("chat Title: ", chatTitle);

  useEffect(() => {
    if (!chatId) return;

    fetch(`/api/chat/get?conversationId=${chatId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then((data) => {
        if (!data || !data.messages) return;
        // Map raw DB rows to the SDK `Message[]` type
        const initial: Message[] = data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content!,
          createdAt: m.createdAt,
        }));
        setMessages(initial);
        setConversationId(chatId);
      })
      .catch(console.error);
  }, [chatId]);

  const chatRef = useChatScroll(messages);
  const formRef = useRef<HTMLFormElement>(null);
  const transitionVariants = {
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 1.5,
        },
      },
    },
  };

  const router = useRouter();
  // const setStoreRoadmapData = useStore((state: any) => state.setRoadmapData);
  const setRoadmap = useRoadmapStore((state) => state.setRoadmap);

  // const clearConversationStarter = useStore(
  //   (state: any) => state.clearConversationStarter
  // );
  // const conversationStarter = useStore(
  //   (state: any) => state.conversationStarter
  // );
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const conversationStarter = searchParams.get("starter");
  useEffect(() => {
    if (conversationStarter && messages.length === 0) {
      setInput(conversationStarter);
      params.delete("starter");
      setIsThinking(true);
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 0);
      router.replace(`?${params.toString()}`);
    }
  }, [conversationStarter]);

  const hasLoadedHistory = useRef(false);

  useEffect(() => {
    if (!hasLoadedHistory.current) {
      // Fetch and load previous messages once
      if (conversationId) {
        fetch(`/api/chat/get?conversationId=${conversationId}`)
          .then((res) => res.json())
          .then((data) => {
            const initial = data.messages.map(
              (m: { id: any; role: any; content: any; createdAt: any }) => ({
                id: m.id,
                role: m.role,
                content: m.content!,
                createdAt: m.createdAt,
              })
            );
            setMessages(initial);
          })
          .catch(console.error)
          .finally(() => {
            hasLoadedHistory.current = true;
          });
      }
      return;
    }

    // From here on it's safe to save new messages
    if (messages.length === 0) return;

    const latest = messages[messages.length - 1];
    if (latest.role !== "user" && latest.role !== "assistant") return;

    postMessage(latest);
  }, [messages, conversationId]);

  return (
    <div
      className="h-full overflow-auto transition-all ease-in-out duration-500"
      ref={chatRef}
    >
      <div className="flex flex-col w-full pt-10 pb-16 px-4  max-w-3xl  mx-auto  min-h-full">
        {messages.length === 0 && (
          <div className="text-center py-8   h-full my-auto">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance font-title text-5xl font-semibold "
            >
              Trace
            </TextEffect>
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto my-6 max-w-xl lg:max-w-2xl  text-muted-foreground"
            >
              I can generate visual roadmaps to help you learn new skills, plan
              your career, or master any topic with a step-by-step plan.
            </TextEffect>
            <div className="text-xs flex justify-center text-muted-foreground gap-2">
              {["React roadmap", "Tech startup roadmap", "Data science"].map(
                (item, idx) => (
                  <AnimatedGroup
                    variants={{
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.75,
                          },
                        },
                      },
                      ...transitionVariants,
                    }}
                    className=" flex gap-4 items-center justify-center"
                    key={idx}
                  >
                    <button
                      className="font-medium border bg-muted px-2 py-1 rounded-sm hover:cursor-pointer"
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
                    {/* <button onClick={increasePopulation}>Increase bears</button> */}
                  </AnimatedGroup>
                )
              )}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            className={` flex pb-8 ${
              message.role === "user" ? "justify-end" : ""
            }`}
            key={index}
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
                          className: "text-3xl font-bold font-title mt-6 mb-4",
                        },
                      },
                      h2: {
                        props: {
                          className:
                            "text-2xl font-semibold font-title mt-5 mb-3",
                        },
                      },
                      h3: {
                        props: {
                          className: "text-xl font-medium font-title mt-4 mb-2",
                        },
                      },
                      ul: {
                        props: {
                          className: "list-disc  pb-1 pl-10",
                        },
                      },
                      ol: {
                        props: {
                          className: "list-decimal pl-5   ",
                        },
                      },
                      li: {
                        props: {
                          className: "my-2 ",
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
                        props: {
                          className: "font-semibold ",
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
                        <div key={partIndex} className="mt-4 w-full">
                          <div className="border rounded-lg px-4  pb-2 bg-muted w-full">
                            <div className="flex justify-between items-center py-2">
                              <h3 className="font-semibold  font-title">
                                {toolInvocation.result.metadata?.topic}
                              </h3>
                              <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="text-xs hover:bg-muted-foreground/20 hover:cursor-pointer"
                                onClick={() => {
                                  setRoadmap(toolInvocation.result);
                                  setIsEditing(true);
                                  setTimeout(() => {
                                    router.push("/roadmaps/studio");
                                  }, 50);
                                }}
                              >
                                {isEditing ? (
                                  <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <>
                                    <BiExpandAlt />
                                  </>
                                )}
                              </Button>
                            </div>
                            <div className="h-96 rounded-lg overflow-hidden bg-white">
                              <ReactFlowProvider>
                                <RoadmapRenderer
                                  roadmapData={toolInvocation.result}
                                />
                              </ReactFlowProvider>
                            </div>
                            <div className="mt-2 text-xs text-center text-gray-500">
                              💡 Tip: You can drag nodes around and zoom this
                              roadmap
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (
                      toolInvocation.toolName === "generateRoadmap" &&
                      toolInvocation.state === "call"
                    ) {
                      return (
                        <div
                          key={partIndex}
                          className="mt-4 p-3 bg-accent/20 rounded-lg border border-accent animate-pulse"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-black">
                              Generating roadmap for:{" "}
                              {toolInvocation.args.topic}
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
          className="w-full left-1/2 -translate-x-1/2 absolute flex justify-center bottom-0 bg-linear-to-t rounded-b-2xl from-white via-white/80 to-transparent py-6 px-4"
        >
          <div className="w-full max-w-3xl relative ">
            <textarea
              id="chat-textarea"
              value={input}
              onChange={handleInputChange}
              placeholder="What are you planning?"
              className="dark:bg-zinc-900 bottom-0  max-h-[192px] min-h-[44px] h-full field-sizing-content w-full pl-4 focus:outline-none placeholder:text-base  rounded-sm bg-muted border resize-none pt-3 pe-14"
              disabled={isThinking}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
            />
            <Button
              type="submit"
              size={"icon"}
              disabled={isThinking}
              className="absolute right-2 bottom-2 border border-black bg-accent text-black"
            >
              {isThinking ? (
                <span className="animate-spin">
                  <LoaderCircle size={16} />
                </span>
              ) : (
                <CornerRightUp size={16} />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
