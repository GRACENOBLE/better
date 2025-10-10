"use client";

import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import CustomButton from "@/components/CustomButton";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Target,
  Users,
  Brain,
  Rocket,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/layout/header";

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

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description:
      "Leverage artificial intelligence to create comprehensive, intelligent roadmaps that adapt to your goals.",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description:
      "Break down complex objectives into manageable, trackable milestones with clear progress indicators.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate detailed project plans in seconds, not hours. Get started immediately with smart templates.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description:
      "Share your roadmaps with team members and stakeholders. Work together towards common objectives.",
  },
];

const benefits = [
  "10x faster planning process",
  "AI-generated actionable steps",
  "Real-time progress tracking",
  "Collaborative workspace",
  "Custom roadmap templates",
  "Integration with popular tools",
];

const page = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-2 md:px-6 pt-32 pb-20 2xl:pb-32 2xl:pt-40">
          <div className="mx-auto max-w-4xl text-center">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6"
            >
              About Better
            </TextEffect>
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="p"
              delay={0.2}
              className="text-balance text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              The AI-powered roadmapping tool that transforms how you plan,
              execute, and achieve your goals.
            </TextEffect>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-28">
        <div className="mx-auto max-w-6xl space-y-16 px-6">
          {/* What is Better Section */}
          <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-6 pb-6">
              <h2 className="text-3xl  font-bold">What is Better?</h2>
              <div className="space-y-4 pb-4">
                <p className=" text-muted-foreground">
                  Better is an AI-powered roadmapping tool that revolutionizes
                  your planning process. Create knowledge-based plans and see
                  them through from start to finish.
                </p>
                <p className="text-muted-foreground">
                  Whether you're planning a career change, building a product,
                  or working towards personal goals, Better provides the
                  structure and intelligence you need to succeed.
                </p>
              </div>
              <AnimatedGroup
                variants={{
                  container: {
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  },
                  item: transitionVariants.item,
                }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/roadmaps/studio">
                  <CustomButton className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </CustomButton>
                </Link>
              </AnimatedGroup>
            </div>
            <div className="relative">
              <img
                className="rounded-lg border h-[400px] w-full object-cover shadow-lg"
                src="/images/canvas.png"
                alt="Better roadmapping interface"
                loading="lazy"
              />
            </div>
          </div>

          <div className="relative">
            <div className="bg-accent rounded-xl p-8 text-center">
              <Rocket className="h-16 w-16 mx-auto" />

              <p className="text-muted-foreground pb-10 pt-6">
                Join thousands of users who have transformed their planning
                process
              </p>
              <Link href="/roadmaps/studio">
                <CustomButton>Create a roadmap</CustomButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
