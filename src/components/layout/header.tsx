import Image from "next/image";
import Container from "../common/container";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Header = () => {
  return (
    <header className="border-b py-4">
      <Container>
        <div className="flex justify-between">
          <Image
            src={"/images/smile.jpg"}
            alt={""}
            width={500}
            height={500}
            className="h-12 object-contain"
          />
          <nav></nav>
          <div>
            <Link
              href={"/sign-in"}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-full"
              )}
            >
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
