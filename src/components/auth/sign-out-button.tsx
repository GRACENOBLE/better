"use client";

import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = async () => {
    setIsSigningOut(true); // Set signing out state to true
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false); // Reset signing out state
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? "Signing Out..." : "Sign Out"}
    </Button>
  );
};

export default SignOutButton;
