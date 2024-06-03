import { AddFriendsForm } from "./add-friends-form";
import { PageTitle } from "@/components/page-title";
import { UserPlus2 } from "lucide-react";
import { auth } from "@/auth";

const FriendsPage = async() => {
  const session = await auth();
  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <UserPlus2 size={32}/>
        <h1>Favor Friends</h1>
      </PageTitle>

      <AddFriendsForm session={session}/>
      <p>Received: {JSON.stringify(session?.user.receivedFriendRequests)}</p><br/>
      <p>Sent: {JSON.stringify(session?.user.sentFriendRequests)}</p> <br/>

      <p>
        Friends: {JSON.stringify(session?.user.friends)}
      </p>
    </main>
  )
}

export default FriendsPage;