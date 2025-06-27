import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Session: ",session);
  

  return (
    <div>
      {" "}
      <Header isPending={!session} user={session?.user}/>
      {children}
      <Footer />
    </div>
  );
}
