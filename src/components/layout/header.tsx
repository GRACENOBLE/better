import Image from "next/image";
import Container from "../common/container";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "../logo";

const Header = () => {
  return (
    <header className="border-b py-4">
      <Container>
        <div className="flex justify-between">
          <Logo/>
          <nav></nav>
          <div>
            <Link
              href={"/auth/sign-in"}
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
