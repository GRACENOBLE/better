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
import { SignUpWithEmailAndPassword } from "@/server/auth/auth";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isSigningUpEmail, setIsSigningUpEmail] = useState<boolean>(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState<boolean>(false);
  const [isSigningInGithub, setIsSigningInGithub] = useState<boolean>(false);
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
  const handleSubmit = async(formData: FormData) => {
    setIsSigningUpEmail(true)
    setError(null)
    const error = await SignUpWithEmailAndPassword(formData)
    if (error) {
      setError(error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="min-w-96 border-none bg-accent shadow-none">
        <CardHeader>
          <CardTitle className="font-title text-center text-4xl font-semibold mb-4">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                {/* <Label htmlFor="name">Name</Label> */}
                <Input
                  id="name"
                  type="name"
                  name="name"
                  placeholder="Name"
                  required
                  className="bg-white"
                  // disabled={
                  //   isSigningUpEmail || isSigningInGithub || isSigningInGoogle
                  // }
                />
              </div>
              <div className="grid gap-2">
                {/* <Label htmlFor="email">Email</Label> */}
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="bg-white"
                  // disabled={
                  //   isSigningUpEmail || isSigningInGithub || isSigningInGoogle
                  // }
                />
              </div>
              <div className="grid gap-2">
                {/* <Label htmlFor="password">Password</Label> */}
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-white"
                  // disabled={
                  //   isSigningUpEmail || isSigningInGithub || isSigningInGoogle
                  // }
                />
              </div>
              <div className="grid gap-2">
                {/* <Label htmlFor="repeatPasword">Repeat Password</Label> */}
                <Input
                  id="repeatPassword"
                  type="password"
                  placeholder="Repeat password"
                  required
                  className="bg-white"
                  // disabled={
                  //   isSigningUpEmail || isSigningInGithub || isSigningInGoogle
                  // }
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4 rounded-full hover:cursor-pointer"
                disabled={
                  isSigningUpEmail || isSigningInGithub || isSigningInGoogle
                }
              >
                {isSigningUpEmail ? (
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
                  //   isSigningUpEmail || isSigningInGithub || isSigningInGoogle
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
                  //   isSigningUpEmail || isSigningInGithub || isSigningInGoogle
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
