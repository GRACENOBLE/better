import React from "react";
import { Mail, SendHorizonal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { LogoCloud } from "@/components/logo-cloud";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate z-10 hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pb-16 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl"
              >
                Becoming who
              </TextEffect>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl"
              >
                you were meant to be.
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-12 max-w-2xl text-pretty text-lg"
              >
                Embark on a journey of self discovery, create your own path,
                take one step at a time and get one step closer each day to a
                better you.
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
                <Link
                  href={"/roadmaps/studio"}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" })
                  )}
                >
                  Create a roadmap
                </Link>
                <form action="" className="mx-auto max-w-sm">
                  <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-md border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                    {/* <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" /> */}

                    <input
                      placeholder="Talk to Better AI"
                      className="h-12 w-full bg-transparent pl-4 focus:outline-none"
                      type="email"
                    />

                    <div className="md:pr-1.5 lg:pr-0">
                      <Button
                        aria-label="submit"
                        size="sm"
                        className="rounded-sm"
                      >
                        <span className="hidden md:block">
                          Start a conversation
                        </span>
                        <SendHorizonal
                          className="relative mx-auto size-5 md:hidden"
                          strokeWidth={2}
                        />
                      </Button>
                    </div>
                  </div>
                </form>
              </AnimatedGroup>
            </div>
            <div className="mx-auto md:-mt-20 lg:-mt-40">
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
              >
                <div className="-rotate-30 aspect-3/2 relative mx-auto lg:w-2/3">
                  <div className="bg-linear-to-b to-background from-background absolute inset-0 via-transparent"></div>
                  <div className="bg-linear-to-l to-background from-background absolute inset-0 via-transparent"></div>
                  <Image
                    src="https://res.cloudinary.com/dg4jhba5c/image/upload/v1741605545/phone-backgroudn_xqgg5g.jpg"
                    alt="Phone Background"
                    width="6240"
                    height="4160"
                  />
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <LogoCloud />
      </main>
    </>
  );
}
