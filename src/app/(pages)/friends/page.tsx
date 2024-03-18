"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { addFriend, getFriends, removeFriends } from "@/lib/dbActions";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

type friend = {
  id: string;
  username: string;
  name: string;
  image: string;
}

// const friends = [
//   {
//     id: '001',
//     username: 'john_doe',
//     name: "John Doe",
//     image: ''
//   },
//   {
//     id: '002',
//     username: 'jane_doe',
//     name: 'Jane Doe',
//     image: ''
//   }
// ]

const Friends = () => {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<friend[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (status !== "authenticated") return;
    
    (async () => {
      const data = await getFriends(session?.user.friends as string[]);
      setFriends(data as friend[] || []);
    })()
  }, [status]);

  const submitAddFriend = async ( e: FormEvent ) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
        
    const res = await addFriend(session?.user.id as string, formData.get('friend-username') as string);

    if (res?.status === 500) {
      setLoading(false);
      return toast.info(res.error);
    }
    
    const data = await getFriends(session?.user.friends as string[]);
    setFriends(data as friend[]);

    form.reset();
    setLoading(false);
    toast.success('Favor Friend Added Successfuly!');
  }

  const submitRemoveFriends = async ( e: FormEvent ) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const friendsToRemove = [];
    for (let i = 0; i < checked.length; i++) {
      if (checked[i+1] === true) {
        friendsToRemove.push(friends[i].id);
      }
    }

    const res = await removeFriends(session?.user.id as string, friendsToRemove);
    const data = await getFriends(res.data as string[]);
    setFriends(data as friend[]);
    
    if (res?.status === 500) {
      setLoading(false);
      return toast.info(res.error);
    }
    
    form.reset();
    setLoading(false);
    toast.success('Favor Friend(s) Removed Successfuly.');    
  }

  return (
    <section className="container mt-8 grid gap-16">
      {/* ADD FRIEND */}
      <form onSubmit={(e) => submitAddFriend(e)} className="grid gap-2">
        <Label>Add a Favor Friend!</Label>
        <div className="flex gap-2">
          <Input disabled={loading} name="friend-username" placeholder="jane_doe" type="text"/> 
          <Button disabled={loading} size='icon' className="shrink-0 size-10"><Plus/></Button>
        </div>
        <span className="text-sm text-muted-foreground">Your friend's username</span>
      </form>

      {/* REMOVE FRIEND */}
      {friends.length > 0 ? (
        <form onSubmit={(e) => submitRemoveFriends(e)}>
          <div className="w-full flex items-center justify-between border-b-2 p-2 transition-colors rounded-t-md md:hover:bg-foreground/20 touch:active:bg-foreground/20">
            <Checkbox checked={checked[0]} onClick={(e) => {
              // I had to work around shadcn's weird checkbox, because it's actually a button, not an actual checkbox
              const isChecked = (e.target as HTMLButtonElement).ariaChecked == "false"
              
              const newValues: boolean[] = [isChecked];
              friends.forEach(() => newValues.push(isChecked));
              setChecked(newValues);
            }}/>
            <Button type="submit" variant='destructive' className="light">
              Remove Friends
            </Button>
          </div>

          {/* FRIENDS LIST */}
          <Accordion collapsible value="0" type="single">
            {friends.map((friend, index) => (
              <AccordionItem value={`${friend.name}-${index}`} key={`friend-${index}`} className="px-2 md:hover:bg-foreground/10 touch:active:bg-foreground/10">
                <div className="flex items-center justify-center gap-4">
                  <Checkbox
                    checked={checked[index+1]}
                    value={friend.id}
                    onClick={(e) => {
                      const newValues = [...checked];
                      newValues[index+1] = (e.target as HTMLButtonElement).ariaChecked == "false"

                      // Setting the "all" selector based off whether or not all other checkboxes are ticked
                      newValues[0] = newValues.every((value, index) => index === 0 || value);

                      setChecked(newValues);
                    }}
                  />
                  <AccordionTrigger className="flex gap-4">
                    <div className="flex-1 flex items-center gap-2">
                      <img src={friend.image as string} className="size-10 rounded-full border-2"/>
                      {friend.name}
                    </div>
                  </AccordionTrigger>
                </div>
                  <AccordionContent>
                    <h2>
                      Incoming Favors:
                    </h2>
                  </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </form>
      ) : (
        (status !== "authenticated") ? (
          <div className="w-full h-full grid text-center gap-2 items-center justify-center">
            <Loader2 size={64} className="max-w-full max-h-full animate-spin mx-auto"/>
            Loading Favor Friends...
          </div>
        ) : (
          // IF THE USER HAS NO FRIENDS
          <div className="w-full h-full grid items-center justify-center">
            <h2 className="w-full text-lg">Oh- It seems you have no friends...</h2>
            <p className="text-sm text-muted-foreground">Here's Andy, he'll always be your friend! Feel free to talk to him.</p>

            <img src="/Andy.svg" className="w-3/4 m-auto pt-8"/>
          </div>
        )
      )}
    </section>
  )
}

export default Friends;