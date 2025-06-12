import { LoginForm } from "@/components/auth/sign-in-form";

const page = () => {
  return (
    <section className="min-h-screen grid place-items-center bg-muted">
      <LoginForm />
    </section>
  );
};

export default page;
