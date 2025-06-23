"use client";

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
import Link from "next/link";
import { SignInWithEmailAndPassword } from "@/server/auth/auth";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createAuthClient } from "better-auth/react";
import CustomButton from "../CustomButton";
import { LoaderCircle } from "lucide-react";

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
  const [isSigningInGoogle, setIsSigningInGoogle] = useState<boolean>(false)
  const [isSigningInGithub, setIsSigningInGithub] = useState<boolean>(false)

  // Client action to handle form submission
  async function handleSubmit(formData: FormData) {
    setError(null);
    const error = await SignInWithEmailAndPassword(formData);

    if (error) {
      setError(error);
    }
  }

  const SignInWithGithub = async () => {
    setIsSigningInGithub(true)
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };
  const SignInWithGoogle = async () => {
    setIsSigningInGoogle(true)
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className={cn("flex flex-col items-center ", className)} {...props}>
      <Card className="min-w-96 bg-accent border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-title text-center text-4xl font-semibold mb-4">
            Sign In
          </CardTitle>
          {/* <CardDescription className="text-black">
            Enter your details to sign in to Better
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                {/* <Label htmlFor="email">Email</Label> */}
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="bg-white"
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
                />
              </div>
              <Button type="submit" className="rounded-full">
                Submit
              </Button>
              <div className="divider">or</div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={SignInWithGoogle}
                  size="icon"
                  className="hover:cursor-pointer rounded-full"
                  type="button"
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
