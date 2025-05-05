import Container from "@/components/common/container";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { buttonVariants } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Flame } from "lucide-react";
import Header from "@/components/layout/header";
import RoadmapCard from "@/components/roadmaps/roadmap-card";
const page = () => {
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

  return (
    <>
      <Header />
      <section className="pt-40 pb-32">
        <Container>
          {" "}
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl"
            >
              Create your own path to a better you
            </TextEffect>
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-12 max-w-2xl text-pretty text-lg"
            >
              Embark on a journey of self discovery, create your own path, take
              one step at a time and get one step closer each day to a better
              you.
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
                Roadmap Studio
              </Link>
            </AnimatedGroup>
          </div>
        </Container>
      </section>
      <section className="py-16 bg-muted min-h-[700px]">
        <Container size="sm">
          <div className="flex justify-between mb-12">
            <h2 className="text-2xl font-semibold">Your roadmaps</h2>

            <div className="border rounded-md p-2 w-fit flex items-center">
              <Flame strokeWidth={1.5} size={20} /> <span>4</span>
            </div>
          </div>

          <Tabs defaultValue="underway" className="">
            <TabsList className="grid grid-cols-4 mx-auto mb-6 bg-muted-foreground/10">
              <TabsTrigger value="all" className="w-[200px]">
                All
              </TabsTrigger>
              <TabsTrigger value="underway" className="w-[200px]">
                Underway
              </TabsTrigger>
              <TabsTrigger value="completed" className="w-[200px]">
                Completed
              </TabsTrigger>
              <TabsTrigger value="bookmarked" className="w-[200px]">
                Bookmarked
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-4 gap-4">
                {[
                  "My personal roadmap name one",
                  "My personal roadmap name two",
                  "My personal roadmap name three",
                  "My personal roadmap name four",
                  "My personal roadmap name five",
                  "My personal roadmap name six",
                  "My personal roadmap name seven",
                  "My personal roadmap name eight",
                  "My personal roadmap name nine",
                  "My personal roadmap name ten",
                ].map((roadmap, index) => (
                  <RoadmapCard
                    key={index}
                    slug={"my-custom-roadmap-1"}
                    type={"in-progress"}
                    bookmarked={false}
                    title={roadmap}
                    deadline={"Jan 20,2025"}
                    progress={32}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="underway">
              <div className="grid grid-cols-4 gap-4">
                {[
                  "My personal roadmap name one",
                  "My personal roadmap name two",
                  "My personal roadmap name three",
                  "My personal roadmap name four",
                  "My personal roadmap name five",
                  "My personal roadmap name six",
                  "My personal roadmap name seven",
                  "My personal roadmap name eight",
                  "My personal roadmap name nine",
                  "My personal roadmap name ten",
                ].map((roadmap, index) => (
                  <RoadmapCard
                    key={index}
                    slug={"my-custom-roadmap-1"}
                    type={"in-progress"}
                    bookmarked={false}
                    title={roadmap}
                    deadline={"Jan 20,2025"}
                    progress={32}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="grid grid-cols-4 gap-2">
                {[
                  "roadmap11",
                  "roadmap21",
                  "roadmap31",
                  "roadmap41",
                  "roadmap51",
                  "roadmap11",
                  "roadmap21",
                  "roadmap31",
                  "roadmap41",
                  "roadmap51",
                ].map((roadmap, index) => (
                  <Link
                    key={roadmap + index}
                    href={"/roadmaps/my-roadmap"}
                    className="border relative rounded-md px-4 py-2 w-full max-w-[259px]"
                  >
                    <p>{roadmap}</p>
                    <Bookmark
                      strokeWidth={1.5}
                      size={16}
                      className="absolute top-1 right-1"
                    />
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="bookmarked">
              <div className="grid grid-cols-4 gap-2">
                {[
                  "roadmap11",
                  "roadmap21",
                  "roadmap31",
                  "roadmap41",
                  "roadmap51",
                  "roadmap11",
                  "roadmap21",
                  "roadmap31",
                  "roadmap41",
                  "roadmap51",
                ].map((roadmap, index) => (
                  <Link
                    key={roadmap + index}
                    href={"/roadmaps/my-roadmap"}
                    className="border relative rounded-md px-4 py-2 w-full max-w-[259px]"
                  >
                    <p>{roadmap}</p>
                    <Bookmark
                      size={16}
                      className="absolute top-1 right-1 fill-foreground/60"
                      stroke="false"
                    />
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </section>
    </>
  );
};

export default page;
