import BackButton from "@/components/auth/back-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

const page = () => {
  return (
    <section className="min-h-screen grid place-items-center bg-muted">
      <BackButton className="absolute top-4 left-4" />
      <div className=" h-full w-full flex flex-col gap-2 items-center justify-center">
        <SignUpForm />
        <Link
          href="/auth/sign-in"
          className="text-sm underline-offset-4 hover:underline"
          aria-label="go to sign in"
        >
          Sign in instead
        </Link>
      </div>
    </section>
  );
};

export default page;
