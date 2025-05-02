import SignOutButton from "@/components/auth/sign-out-button";
import Container from "@/components/common/container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!session) {
  //   redirect("/auth/sign-in")
  // }

  return (
    <section className="pt-32">
      <Container>
        <div>
          {/* <h1>Welcome, {session.user.name}</h1>
          <p>Email: {session.user.email}</p>
          <SignOutButton /> */}
          dash
        </div>
      </Container>
    </section>
  );
};

export default page;
