import { PageTitle } from "@/components/page-title";
import { Users2Icon } from "lucide-react";
import { auth, favor, minimalUser } from "@/auth";
import { CreateGroupForm } from "./group-form";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/prisma/client";

const GroupsPage = async () => {
  const session = await auth();
  const groups = await prisma.favorGroup.findMany({ where: { id: { in: session?.user.favorGroups.map(group => group.id) }}});

  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
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
            <Card key={`group-link-${index}`}>
              <CardHeader>
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