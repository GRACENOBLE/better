"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpWithEmailAndPassword } from "@/server/auth/auth";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const SignInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };
  const SignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={SignUpWithEmailAndPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  name="name"
                  placeholder="John doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeatPasword">Repeat Password</Label>
                <Input id="repeatPassword" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={SignInWithGoogle}
                  variant="outline"
                  className="w-fit"
                  type="button"
                >
                  <FaGoogle />
                </Button>
                <Button
                  onClick={SignInWithGithub}
                  variant="outline"
                  className="w-fit"
                  type="button"
                >
                  <FaGithub />
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link
                href="/auth/sign-in"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
