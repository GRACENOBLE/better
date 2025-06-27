"use client";

import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignOutButton = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = async () => {
    setIsSigningOut(true); // Set signing out state to true
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.reload(); // reload the window
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false); // Reset signing out state
    }
  };

  return (
    <Button
      className="-translate-x-2"
      variant={"ghost"}
      size={"sm"}
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? "Signing Out..." : "Sign Out"}
    </Button>
  );
};

export default SignOutButton;
