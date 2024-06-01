import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";

export default async function Home() {
  const session = await auth();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(session)}
      <AuthForm provider='nodemailer'/>
    </main>
  );
}
