import { FavorForm } from "@/components/favor-form";
import { PageTitle } from "@/components/page-title";
import { HomeIcon } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  

  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <HomeIcon size={32}/>
        <h1>Favor Requests</h1>
      </PageTitle>

        {/* <Drawer>
          <DrawerTrigger asChild>
            <Button>Create Favor Request</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader> */}
              
            {/* </DrawerHeader>
          </DrawerContent>
        </Drawer> */}
        <FavorForm friends={session?.user.friends} balance={session?.user.favorPoints as number}/>
    </main>
  );
}
