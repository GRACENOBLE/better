"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignInWithEmailAndPassword } from "@/server/auth/auth";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createAuthClient } from "better-auth/react";
import CustomButton from "../CustomButton";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Login"}
    </Button>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const authClient = createAuthClient();
  const [error, setError] = useState<string | null>(null);
  const [isSigningInEmail, setIsSigningInEmail] = useState<boolean>(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState<boolean>(false);
  const [isSigningInGithub, setIsSigningInGithub] = useState<boolean>(false);

  useEffect(() => {
    // You can replace this with any tracking/analytics logic
    console.log("Login error:", error);
  }, [error]);
  // Client action to handle form submission
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const decodedReturnTo = returnTo ? decodeURIComponent(returnTo) : "/";

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await SignInWithEmailAndPassword(formData);
      router.push(decodedReturnTo);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSigningInEmail(false);
    }
  }

  const SignInWithGithub = async () => {
    setIsSigningInGithub(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };
  const SignInWithGoogle = async () => {
    setIsSigningInGoogle(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div
      className={cn("flex flex-col items-center w-full", className)}
      {...props}
    >
      <Card className="w-full md:w-96 bg-accent border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-title text-center text-4xl font-semibold mb-4">
            Sign In
          </CardTitle>
          {/* <CardDescription className="text-black">
            Enter your details to sign in to Better
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form
            action={handleSubmit}
            onSubmit={() => {
              setIsSigningInEmail(true);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="relative grid gap-2">
                {error && (
                  <div className="absolute -top-10 left-[50%] -translate-x-[50%] text-nowrap  text-center text-destructive px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}
                {/* <Label htmlFor="email">Email</Label> */}
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="bg-white"
                  // disabled={
                  //   isSigningInEmail || isSigningInGithub || isSigningInGoogle
                  // }
                />
              </div>
              <div className="grid gap-2 mb-4">
                <div className="flex items-center">
                  {/* <Label htmlFor="password">Password</Label> */}
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-white"
                  // disabled={
                  //   isSigningInEmail || isSigningInGithub || isSigningInGoogle
                  // }
                />
              </div>
              <Button
                type="submit"
                className="rounded-full"
                // disabled={
                //   isSigningInEmail || isSigningInGithub || isSigningInGoogle
                // }
              >
                {isSigningInEmail ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="divider">or</div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={SignInWithGoogle}
                  size="icon"
                  className="hover:cursor-pointer rounded-full"
                  type="button"
                  // disabled={
                  //   isSigningInEmail || isSigningInGithub || isSigningInGoogle
                  // }
                >
                  {isSigningInGoogle ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <FaGoogle />
                  )}
                </Button>
                <Button
                  onClick={SignInWithGithub}
                  size="icon"
                  className=" hover:cursor-pointer rounded-full"
                  type="button"
                  // disabled={
                  //   isSigningInEmail || isSigningInGithub || isSigningInGoogle
                  // }
                >
                  {isSigningInGithub ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <FaGithub />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
