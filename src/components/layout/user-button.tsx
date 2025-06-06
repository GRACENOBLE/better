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
import { LoaderCircle } from "lucide-react";
import CustomButton from "../CustomButton";

const UserButton = ({
  user,
  isScrolled,
  isPending,
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
  isPending: boolean;
}) => {
  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          {/* <Link
            href={"/dashboard"}
            className={
              "rounded-sm hover:bg-muted transition-all ease-in-out duration-300 border py-[2px] px-3 text-sm"
            }
          >
            Dashboard
          </Link> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-full hover:cursor-pointer border h-10 w-10 grid place-items-center bg-muted">
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
      ) : isPending ? (
        <div className="rounded-full border h-10 w-10 grid place-items-center bg-muted animate-spin">
          {" "}
          <LoaderCircle size={20} />
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
          <Link href="/auth/sign-in">
            <CustomButton size="default">
              Sign in
            </CustomButton>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserButton;
