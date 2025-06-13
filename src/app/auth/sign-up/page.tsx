import BackButton from "@/components/auth/back-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen grid grid-cols-2 place-items-center">
      <BackButton className="absolute top-4 left-4" />

      <div>
        <div className="mt-4 text-center flex flex-col gap-8 items-center">
          <Image src={"/images/logo-yellow.svg"} alt={""} height={500} width={500} className="h-20 w-20 rounded-xl"/>
          <Link href="/auth/sign-in" className="underline underline-offset-4">
            <Button className="rounded-full px-8 hover:cursor-pointer">I have an account</Button>
          </Link>
        </div>
      </div>
      <div className="bg-accent h-full w-full flex flex-col items-center justify-center">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
