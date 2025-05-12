"use client";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface RoadmapCardProps {
  slug: string;
  type: "in-progress" | "completed";
  bookmarked: boolean;
  title: string;
  deadline: string;
  progress: number;
}

const RoadmapCard = ({
  slug,
  title,
  type,
  bookmarked,
  deadline,
  progress,
}: RoadmapCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked);

  const handleToggleBookMark = () => {
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="border flex flex-col justify-between relative rounded-md p-4  w-full h-60 max-w-[259px] bg-white">
      <button
        onClick={handleToggleBookMark}
        className="absolute top-2 right-2 z-20"
      >
        <Bookmark size={16} strokeWidth={1.5} fill={isBookmarked?"foreground":""}/>
      </button>
      <div>
        <span
          className={cn("text-xs px-2 rounded-sm py-1", {
            "bg-yellow-400": type == "in-progress",
            "bg-green-500": type == "completed",
          })}
        >
          {type == "in-progress"
            ? "In progress"
            : type == "completed"
            ? "`completed"
            : "Other"}
        </span>
        <Link
          href={"/roadmaps/" + slug}
          className="text-xl line-clamp-2 font-semibold mt-3 max-w-[200px] hover:underline"
        >
          {title}
        </Link>
      </div>
      <div className="flex-col flex gap-4">
        <div>
          <p className="text-xs">DEADLINE</p>
          <p className="font-semibold text-sm">Jan 20,2025</p>
        </div>
        <div>
          <div className="text-xs flex justify-between mb-1">
            <p>PROGRESS</p>
            {progress}%
          </div>
          <Progress value={progress} />
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard;
