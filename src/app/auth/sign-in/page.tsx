import BackButton from "@/components/auth/back-button";
import { LoginForm } from "@/components/auth/sign-in-form";
import Container from "@/components/common/container";
import Link from "next/link";

const page = () => {
  return (
    <section className="min-h-screen grid place-items-center bg-muted">
      <BackButton className="absolute top-4 left-4" />
      <Container className="h-full w-full flex flex-col gap-2 items-center justify-center">
        <LoginForm />
        <Link
          href="/auth/sign-up"
          className="text-sm underline-offset-4 hover:underline"
          aria-label="go to sign up"
        >
          Sign up instead
        </Link>
      </Container>
    </section>
  );
};

export default page;
