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

  console.log(response);

  if (response.user && response.token) {
    redirect("/");
  }

  return null;
};

export const SignUpWithEmailAndPassword = async (formData: FormData) => {
  // console.log("FormData: ", formData);

  const response = await auth.api.signUpEmail({
    body: {
      email: formData.get("email") as string, // user email address
      password: formData.get("password") as string, // user password -> min 8 characters by default
      name: formData.get("name") as string,
    },
  });
  console.log(response);
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
