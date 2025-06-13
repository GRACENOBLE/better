import BackButton from "@/components/auth/back-button";
import { LoginForm } from "@/components/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <section className="min-h-screen grid grid-cols-2 place-items-center bg-muted">
      <BackButton className="absolute top-4 left-4" />
      <div className="bg-accent h-full w-full flex flex-col items-center justify-center">
        <LoginForm />
      </div>
      <div className="mt-4 text-center flex flex-col gap-8 items-center">
        <Image
          src={"/images/logo-yellow.svg"}
          alt={""}
          height={500}
          width={500}
          className="h-20 w-20 rounded-xl"
        />
        <Link
          href="/auth/sign-up"
          aria-label="go to sign up"
          className=" h-fit w-fit hover:cursor-pointer"
        >
          <Button className="rounded-full px-8 ">Create an account</Button>
        </Link>
      </div>
    </section>
  );
};

export default page;
