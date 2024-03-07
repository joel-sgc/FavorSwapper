import { AuthButton } from "@/components/auth-button";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  console.log(session)
  return (
    <main>
      {session && JSON.stringify(session)}
      <AuthButton/>
    </main>
  );
}
