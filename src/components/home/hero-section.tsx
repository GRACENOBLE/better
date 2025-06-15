import React from "react";
import { CornerRightUp, SendHorizonal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { LogoCloud } from "@/components/logo-cloud";
import Link from "next/link";
import CustomButton from "../CustomButton";
import { submitToChatPage } from "@/server/chat";

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

export default function HeroSection() {
  return (
    <>
      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-6 pt-40 pb-32 2xl:pb-48 2xl:pt-48 ">
          <div className=" mx-auto max-w-4xl text-center">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance font-title text-4xl font-semibold sm:text-5xl md:text-6xl"
            >
              Create a plan for
            </TextEffect>
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance text-4xl font-title font-semibold sm:text-5xl md:text-6xl"
            >
              anything!
            </TextEffect>
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-12 max-w-2xl text-pretty text-lg"
            >
              Increase your chances of "Getting it done!". Plan with Better AI
              and create a custom roadmap with clearly defined timelines and
              deliverables.
            </TextEffect>

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
              className="mt-12 flex gap-4 items-center justify-center"
            >
              <Link href={"/roadmaps/studio"} aria-label="go to roadmap studio">
                <CustomButton size="lg">Create a roadmap</CustomButton>
              </Link>

              <form
                method="POST"
                action={submitToChatPage}
                className="mx-auto max-w-sm"
              >
                <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-full border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                  {/* <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" /> */}

                  <input
                    placeholder="Plan with Better AI"
                    className="h-12 w-full bg-transparent pl-4 focus:outline-none placeholder:text-base"
                    type="text"
                    name="chatStarter"
                  />

                  <div className="md:pr-1.5 lg:pr-0">
                    <button
                      aria-label="submit to better chat"
                      className="rounded-full bg-black text-white p-2 hover:cursor-pointer"
                    >
                      <span className="hidden md:block">
                        <CornerRightUp size={20} />
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </AnimatedGroup>
          </div>
        </div>
      </section>
      <LogoCloud />
    </>
  );
}
