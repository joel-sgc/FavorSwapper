import { PageTitle } from "@/components/page-title";
import { ArrowLeftRightIcon } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  

  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <ArrowLeftRightIcon size={32}/>
        <h1>Favor Requests</h1>
      </PageTitle>



    </main>
  );
}
