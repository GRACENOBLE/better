"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const SignInWithEmailAndPassword = async (formData: FormData) => {
  console.log("Signing in with email and passwword...: ", formData);

  const response = await auth.api
    .signInEmail({
      body: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      asResponse: true, // returns a response object instead of data
    })
    .then((res) => res.json())
    .catch((error) => {
      console.log("Error signing in: ", error);
      return error;
    });

  if (response.user && response.token) {
    redirect("/dashboard");
  }

  return null;
};
