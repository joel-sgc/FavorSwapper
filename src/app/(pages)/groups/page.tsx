import { PageTitle } from "@/components/page-title";
import { Users2Icon } from "lucide-react";
import { auth } from "@/auth";
import { CreateGroupForm } from "./group-form";
import Link from "next/link";

const GroupsPage = async () => {
  const session = await auth();

  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <Users2Icon size={32} />
        <h1>Favor Groups</h1>
      </PageTitle>

      <CreateGroupForm session={session}/>
      {session?.user.favorGroups.map((group, index) => (
        <Link href={`/groups/${group.id}`} key={`favor-group-${index}-${group.id}`}>{group.name} - {group.admins.map((admin) => admin.name)}</Link>
      ))}
    </main>
  )
}

export default GroupsPage