"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addFriend } from "@/lib/xataActions";

export const AddFriendForm = ({ id, friends }: { id: string, friends: string[] }) => {
  const [loading, setLoading] = useState(false);

  const submit = async ( e: FormEvent ) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (friends && friends.includes(formData.get('friend-username') as string)) {
      form.reset();
      setLoading(false);
      return toast.error("This person is already a friend!")
    }

    await addFriend(id, friends, formData.get('friend-username') as string);
    toast.success('Favor Friend Added Successfuly!')
  }

  return (
    <form onSubmit={(e) => submit(e)} className="grid gap-2">
      <Label>Add a Favor Friend!</Label>
      <div className="flex gap-2">
        <Input disabled={loading} name="friend-username" placeholder="jane_doe" type="text"/> 
        <Button disabled={loading} size='icon' className="shrink-0 size-10"><Plus/></Button>
      </div>
      <span className="text-sm text-muted-foreground">Your friend's username</span>
    </form>
  )
}