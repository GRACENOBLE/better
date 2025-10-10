import React from "react";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { LogoCloud } from "@/components/logo-cloud";
import Link from "next/link";
import CustomButton from "../CustomButton";
import HeroInput from "../ai/hero-input";

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
        <div className="mx-auto max-w-6xl px-2 md:px-6 pt-40 pb-32 2xl:pb-48 2xl:pt-48 ">
          <div className=" mx-auto max-w-4xl text-center">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Create a plan for
            </TextEffect>
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance text-4xl font-bold sm:text-5xl lg:text-6xl"
            >
              anything!
            </TextEffect>
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-6 md:mt-12 max-w-2xl text-pretty lg:text-lg"
            >
              Increase your chances of "Getting it done!". Plan with Jarvis
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
              <Link
                href={"/roadmaps/studio"}
                aria-label="go to roadmap studio"
                className=""
              >
                <CustomButton size="lg">Create a roadmap</CustomButton>
              </Link>
              <HeroInput />
            </AnimatedGroup>
          </div>
        </div>
      </section>
      <section className="pt-20 md:pt-0">
        <LogoCloud />
      </section>
    </>
  );
}
