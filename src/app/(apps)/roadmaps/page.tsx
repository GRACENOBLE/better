"use client";

import Container from "@/components/common/container";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { TextEffect } from "@/components/ui/text-effect";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Bookmark, Flame } from "lucide-react";
import Header from "@/components/layout/header";
import RoadmapCard from "@/components/projections/roadmap-card";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";

interface Roadmap {
  id: string;
  title: string;
  nodes: any[];
  edges: any[];
  metadata?: any;
  progress: number;
  createdAt: string;
}

const page = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch("/api/roadmaps");
        if (res.ok) {
          const data = await res.json();
          setRoadmaps(data);
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

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
      <section className="pt-40 pb-32 bg-accent">
        <Container size="sm">
          <div className="flex flex-col items-center">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="text-balance max-w-3xl text-center text-4xl font-title font-semibold sm:text-5xl md:text-5xl"
            >
              Create a custom roadmap with roadmap studio.
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
              className="mt-12 w-fit"
            >
              <Link href={"/roadmaps/studio"}>
                <CustomButton size="lg">
                  <span className="flex gap-1 items-center">
                    ROADMAP STUDIO
                    <ArrowRight size={20} />
                  </span>
                </CustomButton>
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
                {roadmaps.map((roadmap) => (
                  <RoadmapCard
                    key={roadmap.id}
                    slug={roadmap.id}
                    type={roadmap.progress === 100 ? "completed" : "in-progress"}
                    bookmarked={false}
                    title={roadmap.title}
                    deadline={new Date(roadmap.createdAt).toLocaleDateString()}
                    progress={roadmap.progress}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="underway">
              <div className="grid grid-cols-4 gap-4">
                {roadmaps.filter(r => r.progress < 100).map((roadmap) => (
                  <RoadmapCard
                    key={roadmap.id}
                    slug={roadmap.id}
                    type="in-progress"
                    bookmarked={false}
                    title={roadmap.title}
                    deadline={new Date(roadmap.createdAt).toLocaleDateString()}
                    progress={roadmap.progress}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="grid grid-cols-4 gap-2">
                {roadmaps.filter(r => r.progress === 100).map((roadmap) => (
                  <RoadmapCard
                    key={roadmap.id}
                    slug={roadmap.id}
                    type="completed"
                    bookmarked={false}
                    title={roadmap.title}
                    deadline={new Date(roadmap.createdAt).toLocaleDateString()}
                    progress={roadmap.progress}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="bookmarked">
              <div className="grid grid-cols-4 gap-2">
                {/* Bookmarked roadmaps will be implemented later */}
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </section>
    </>
  );
};

export default page;
