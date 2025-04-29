"use server"
import { auth } from "@/lib/auth";

export const SignInWithEmailAndPassword = async (formData: FormData) => {
  console.log("FormData: ", formData);

  const response = await auth.api
    .signInEmail({
      body: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      asResponse: true, // returns a response object instead of data
    })
    .then((res) => res.json());
  console.log(response);
};
