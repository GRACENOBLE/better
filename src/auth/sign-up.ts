"use server";
import { authClient } from "@/lib/auth-client"; //import the auth client

// interface emailUser {
//   email: string;
//   password: string;
//   name: string;
// }
export const SignUpWithEmailAndPassword = async (formData: FormData) => {
  const { data, error } = await authClient.signUp.email(
    {
      email: (formData.get("email") as string) || "", // user email address
      password: (formData.get("password") as string) || "", // user password -> min 8 characters by default
      name: (formData.get("name") as string) || "", // user display name
      callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    }
  );

  if (error) {
    console.log(
      "Encountered an error signing up with Email and password: ",
      error
    );
    return;
  }

  console.log("Successfully signed Up user through email and password:", data);
};
