"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant={"ghost"}
      size={"icon"}
      className={cn(className ,"hover:cursor-pointer")}
    >
      <ArrowLeft />
    </Button>
  );
};

export default BackButton;
