import { PageTitle } from "@/components/page-title";
import { ArrowLeftRightIcon } from "lucide-react";
import { auth, favor } from "@/auth";
import { FavorComp } from "@/components/favor-comp";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex-1 flex flex-col gap-4 p-4 pb-[72px]">
      <PageTitle>
        <ArrowLeftRightIcon size={32}/>
        <h1>Favor Requests</h1>
      </PageTitle>

      {(session?.user?.receivedFavors as favor[]).length > 0 && session?.user.receivedFavors.map((favor) => (
        <FavorComp key={`favor-user-to-user-${favor.id}-${session.user.id}-${favor?.receiver?.id as string}`} favor={favor}/>
      ))}
    </main>
  );
}
