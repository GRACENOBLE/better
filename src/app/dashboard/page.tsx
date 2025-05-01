import { getCurrentSession } from "@/server/auth/session";
// import { redirect } from "next/navigation";

const page = async () => {
  const session = await getCurrentSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
};

export default page;
