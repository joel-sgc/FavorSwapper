"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendFriendReq } from "@/lib/friendActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FavorGroup } from "@prisma/client";

export const friendFormSchema = z.object({
  username: z.string().min(2).max(50).toLowerCase().trim().refine((value) => value.split(' ').join('')),
});

export const AddUserToGroupForm = ({ group, session }: { group: FavorGroup, session: Session | null }) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof friendFormSchema>>({
    resolver: zodResolver (friendFormSchema),
    defaultValues: {
      username: "",
    },
  });

  function normalizeUsername( value: string, regex: RegExp, max: number) {
    return value.toLowerCase().trim().split(' ').join('').replace(regex, '').slice(0, max)
  }

  async function onSubmit(data: z.infer<typeof friendFormSchema>) {
    setLoading(true);
    
    const res = await sendFriendReq(
      data.username,
      session?.user as Session["user"]
    );

    setLoading(false);

    if (res.status === 200) {
      toast.success('Friend request sent.');
      form.reset();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="john_doe" {...field} onChange={(event) => {field.onChange(normalizeUsername(event.currentTarget.value, /[^a-z0-9._]+/g, 20))}}/>
              </FormControl>
              <FormDescription>
                This is your new friend's username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-auto mt-[32px]">Add Friend</Button>
      </form>
    </Form>
  )
}