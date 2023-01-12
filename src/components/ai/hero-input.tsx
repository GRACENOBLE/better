"use client";

import { useStore } from "@/hooks/zustand";
import { CornerRightUp, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HeroInput = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [isSendingStarter, setIsSendingStarter] = useState<boolean>(false);
  const handleSubmit = () => {
    router.push("/chat/new?starter=" + encodeURIComponent(userInput));
  };
  return (
    <form
      onSubmit={(e) => {
        setIsSendingStarter(true);
        e.preventDefault();
        handleSubmit();
      }}
      className="mx-auto max-w-sm hidden md:block "
    >
      <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-full border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
        {/* <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" /> */}

        <input
          placeholder="Plan with Better AI"
          className="h-12 w-full bg-transparent pl-4 focus:outline-none placeholder:text-base overflow-hidden"
          type="text"
          name="starter"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          autoComplete="off"
        />

        <div className="lg:pr-0">
          <button
            aria-label="submit to better chat"
            className="rounded-full bg-black text-white p-2 hover:cursor-pointer"
            type="submit"
          >
            <span className="hidden md:block">
              {isSendingStarter ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <CornerRightUp size={20} />
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeroInput;
