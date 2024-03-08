import { AuthButton } from "@/components/auth-button";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="container">
      {/* <AuthButton/> */}
    </main>
  );
}
