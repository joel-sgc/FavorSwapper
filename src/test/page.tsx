import { getGroupFromID } from "@/lib/server-actions";
import { FavorComp } from "@/components/favor-comp";
import { auth, favor } from "@/auth";
import { Session } from "next-auth";

export default async function TesterPage() {
  const session = await auth();
  const group = await getGroupFromID(session?.user.favorGroups[0] as string);
  
  return (
    <main className="flex-1 p-4 flex flex-col gap-4 pb-[72px]">
      {[...session?.user.sentFavors as favor[], ...session?.user.receivedFavors as favor[], ...JSON.parse(group?.favors as string)].map((favor) => (
        <FavorComp
          key={`favor-${favor.id}-${session?.user.id}`}
          favor={favor}
          user={session?.user as Session["user"]}
        />
      ))}
    </main>
  )
}