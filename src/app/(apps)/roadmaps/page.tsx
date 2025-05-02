import Container from "@/components/common/container";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { buttonVariants } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <section className="py-16 bg-muted">
        <Container>
          <h2 className="text-2xl font-semibold">Your roadmaps</h2>
          <div>
            <div className="border rounded-md py-2 px-4 w-fit">
              4 day streak
            </div>
            <div>
              <Tabs defaultValue="underway" className="">
                <TabsList className="grid grid-cols-2 mx-auto w-[400px] bg-muted-foreground/10">
                  <TabsTrigger value="underway">Underway</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="underway">
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      "roadmap1",
                      "roadmap2",
                      "roadmap3",
                      "roadmap4",
                      "roadmap5",
                      "roadmap1",
                      "roadmap2",
                      "roadmap3",
                      "roadmap4",
                      "roadmap5",
                    ].map((roadmap, index) => (
                      <Link
                        key={roadmap + index}
                        href={"/roadmaps/my-roadmap"}
                        className="border rounded-md px-4 py-2 w-full max-w-[259px]"
                      >
                        {roadmap}
                      </Link>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed">
                  <div className="grid grid-cols-5 gap-2">
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
                        className="border rounded-md px-4 py-2 w-full max-w-[259px]"
                      >
                        {roadmap}
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default page;
