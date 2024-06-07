import { PageTitle } from "@/components/page-title";
import { ChevronRightIcon, Component, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { auth, favorGroup } from "@/auth";
import prisma from "@/prisma/client"
import { GroupInfoDrawer } from "./group-info-drawer";
import { Button } from "@/components/ui/button";

const GroupPage = async ({ params }: { params: { id: string }}) => {
  const group = await prisma.favorGroup.findUnique({ where: { id: params.id }});
  const session = await auth();

  // Check to make sure we are within the group
  const members = JSON.parse(group?.members as string) as favorGroup[]
  const isMember = members.some(member => member.id === session?.user.id)

  if (isMember) return (
    <main className="flex-1 flex flex-col gap-4 p-4">
        <PageTitle className="justify-between">
          <div className="flex items-center gap-2">
            <Component size={32} />
            <h1>{group ? group?.name : "Loading..."}</h1>
          </div>
      
          <GroupInfoDrawer group={group}>
            <Button variant='secondary' size='icon'>
              <ChevronRightIcon size={32} className="cursor-pointer"/>
            </Button>
          </GroupInfoDrawer>
        </PageTitle>


      {/* LOADING */}
      {!group && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={64} className="animate-spin"/>
        </div>
      )}
    </main>
  )
  else redirect('/groups');
}

export default GroupPage