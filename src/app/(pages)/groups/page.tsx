import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageTitle } from "@/components/page-title";
import { auth, favor, minimalUser } from "@/auth";
import { CreateGroupForm } from "./group-form";
import { Badge } from "@/components/ui/badge";
import { Users2Icon } from "lucide-react";
import prisma from "@/prisma/client";
import Link from "next/link";

const GroupsPage = async () => {
  const session = await auth();
  const groups = await prisma.favorGroup.findMany({ where: { id: { in: session?.user.favorGroups }}});

  return (
    <main className="flex-1 flex flex-col gap-4 p-4 pb-[72px]">
      <PageTitle>
        <Users2Icon size={32} />
        <h1>Favor Groups</h1>
      </PageTitle>

      <CreateGroupForm session={session}/>
      <div className="mt-8 grid gap-4">
        {groups.map((group, index) => {
          const favors = JSON.parse(group.favors) as favor[];
          
          return (
          <Link key={index} href={`/groups/${group.id}`}>
            <Card key={`group-link-${index}`} className="flex items-center justify-start">
              <Avatar className="size-14 ml-6 rounded-lg">
                <AvatarImage src={group?.image as string} alt="" aria-hidden referrerPolicy="no-referrer"/>
                <AvatarFallback className="text-3xl rounded-none">{group?.name?.substring(0,3).trim()}</AvatarFallback>
              </Avatar>

              <CardHeader className="flex-1 pl-2">
                <CardTitle className="flex justify-between text-xl">
                  <span>{group.name}</span>

                  <Badge variant={favors.length === 0 ? 'secondary' : 'default'}>{favors.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Members: {(JSON.parse(group.members) as minimalUser[]).map((member) => member.name).join(', ')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )})}
      </div>
    </main>
  )
}

export default GroupsPage