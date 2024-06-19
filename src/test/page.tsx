import { auth, favor } from "@/auth";
import { FavorComp } from "@/components/favor-comp";

export default async function TesterPage() {
  const session = await auth();

  return (
    <main className="flex-1 p-4 flex flex-col gap-4 pb-[72px]">
      {session?.user.sentFavors.map((favor) => (
        <FavorComp
          favor={favor}
          user={session?.user}
        />
      ))}
    </main>
  )
}