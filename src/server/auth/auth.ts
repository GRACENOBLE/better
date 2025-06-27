"use server";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const SignInWithEmailAndPassword = async (formData: FormData) => {
  console.log("Signing in with email and password...: ", formData);
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      asResponse: true,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody?.message || `Sign in failed with status ${response.status}`);
    }

    // Optionally, handle successful sign-in here (e.g., redirect or return user info
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const SignUpWithEmailAndPassword = async (formData: FormData) => {
  console.log("Signing up with cridentials: ", formData);

  const response = await auth.api.signUpEmail({
    body: {
      email: formData.get("email") as string, // user email address
      password: formData.get("password") as string, // user password -> min 8 characters by default
      name: formData.get("name") as string,
    },
  });
  console.log(response);
  return null;
};

// export const SignInWithGithub = async () => {
//   const response = await auth.api.signInSocial({
//     body: {
//       provider: "github",
//     },
//   });
//   console.log(response);
//   if (response.url) {
//     redirect(response.url);
//   } else {
//     console.error("Redirect URL is undefined");
//   }
// };
