import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AddFriendsForm } from "./add-friends-form";
import { PageTitle } from "@/components/page-title";
import { UserPlus2 } from "lucide-react";
import { auth } from "@/auth";
import { FriendRequest } from "./friend-request";
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
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <UserPlus2 size={32}/>
        <h1>Favor Friends</h1>
      </PageTitle>

      <AddFriendsForm session={session}/>

      <hr/>

      <Accordion type="multiple" defaultValue={defaultAccordionValue}>
        <AccordionItem value="friend-requests">
          <AccordionTrigger className="pt-0 font-semibold text-xl">Friend Requests</AccordionTrigger>
          <AccordionContent>
            {session?.user.receivedFriendRequests.map((request, index) => (
              <FriendRequest key={`friend-request-${index}`} session={session} request={request}/>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="friends" >
          <AccordionTrigger className="font-semibold text-xl">Friends</AccordionTrigger>
          <AccordionContent>
            {session?.user.friends.map((friend, index) => (
              <Friend friend={friend} key={`friend-${index}`} user={session.user}/>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default FriendsPage;