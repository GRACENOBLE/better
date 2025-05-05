import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({
  size,
  variant,
}: {
  size?: "sm" | "md" | "lg";
  variant?: "logo" | "logomark" | "wordmark";
}) => {
  return (
    <Link href={"/"} aria-label="go home" className="flex items-center gap-2">
      {!(variant == "wordmark") && (
        <Image
          src={"/images/smile.jpg"}
          alt={""}
          width={500}
          height={500}
          className={cn("h-12 w-12 object-cover rounded-md", {
            "h-8 w-8": size == "sm",
            "h-12 w-12": size == "md",
            "h-16 w-16": size == "lg",
          })}
        />
      )}
      {!(variant == "logo") && (
        <span className="text-2xl font-medium">Better</span>
      )}
    </Link>
  );
};

export default Logo;
