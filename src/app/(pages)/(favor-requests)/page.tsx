import { auth } from "@/auth";
import { PageTitle } from "@/components/page-title";
import prisma from "@/prisma/client";
import { HomeIcon } from "lucide-react";
import { FavorComp } from "./Favor";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { FavorForm } from "@/components/favor-form";

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
        <FavorForm friends={session?.user.friends}/>
        {/* {receivedFavors.map((favor, index) => (
          <FavorComp key={`favor-comp-${index}`} request={favor} index={index} />
        ))} */}
    </main>
  );
}
