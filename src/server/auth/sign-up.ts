"use server";
import { auth } from "@/lib/auth";

export const SignUpWithEmailAndPassword = async (formData: FormData) => {
  console.log("FormData: ", formData);

  const response = await auth.api
    .signUpEmail({
      body: {
        email: formData.get("email") as string, // user email address
        password: formData.get("password") as string, // user password -> min 8 characters by default
        name: formData.get("name") as string,
      },
    })
  console.log(response);
};
