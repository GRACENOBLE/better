import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "../auth/sign-out-button";

const UserButton = ({
  user,
  isScrolled,
}: {
  user:
    | {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null | undefined | undefined;
      }
    | undefined;
  isScrolled: boolean;
}) => {
  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <Link
            href={""}
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Dashboard
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-full h-12 w-12 grid place-items-center bg-muted">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton />
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(isScrolled && "lg:hidden")}
          >
            <Link href="/auth/sign-in">
              <span>Login</span>
            </Link>
          </Button>
          <Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
            <Link href="/auth/sign-up">
              <span>Sign Up</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
          >
            <Link href="#">
              <span>Get Started</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
