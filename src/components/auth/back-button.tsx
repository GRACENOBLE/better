import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const BackButton = ({ className }: { className?: string }) => {
  return (
    <Link
      href={"/"}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), className)}
    >
      <X />
    </Link>
  );
};

export default BackButton;
