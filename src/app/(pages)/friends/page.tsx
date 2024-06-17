import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IncomingFriendRequest, OutgoingFriendRequest } from "./friend-request";
import { AddFriendsForm } from "./add-friends-form";
import { PageTitle } from "@/components/page-title";
import { auth, minimalUser } from "@/auth";
import { UserPlus2 } from "lucide-react";
import { Friend } from "./friend";

const FriendsPage = async() => {
  const session = await auth();

  let defaultAccordionValue = [];
  if (session?.user.friends.length === 0) {
    if (session?.user.receivedFriendRequests.length > 0) {
      defaultAccordionValue.push("friend-requests");
    }
  } else defaultAccordionValue.push("friends");

  return (
    <main className="flex-1 flex flex-col gap-4 p-4 pb-[72px]">
      <PageTitle>
        <UserPlus2 size={32}/>
        <h1>Favor Friends</h1>
      </PageTitle>

      <AddFriendsForm session={session}/>

      <hr/>

      <Accordion type="multiple" defaultValue={defaultAccordionValue}>
        <AccordionItem value="friend-requests" disabled={session?.user.receivedFriendRequests.length === 0 && session.user.sentFriendRequests.length === 0}>
          <AccordionTrigger className="pt-0 font-semibold text-xl">Friend Requests</AccordionTrigger>
          <AccordionContent className="grid gap-4">
            {session && session?.user.receivedFriendRequests.map((request, index) => (
              <IncomingFriendRequest key={`incoming-friend-request-${index}`} session={session} request={request}/>
            ))}
            {session && session?.user.sentFriendRequests.map((request, index) => (
              <OutgoingFriendRequest key={`outgoing-friend-request-${index}`} request={request}/>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="friends" disabled={session?.user.friends.length === 0}>
          <AccordionTrigger className="font-semibold text-xl">Friends</AccordionTrigger>
          <AccordionContent className="grid gap-4">
            {session && (session?.user?.friends as minimalUser[]).length > 0 && session?.user.friends.map((friend, index) => (
              <Friend friend={friend} key={`friend-${index}`} user={session.user}/>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default FriendsPage;