"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroup } from "@/lib/groupActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const friendFormSchema = z.object({
  name: z.string().min(2).max(50).trim(),
});

export const CreateGroupForm = ({ session }: { session: Session | null }) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof friendFormSchema>>({
    resolver: zodResolver (friendFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof friendFormSchema>) {
    setLoading(true);
    const res = await createGroup({ groupName: data.name, user: session?.user as Session["user"]});
    setLoading(false);

    if (res.status === 200) {
      toast.success(res.message);
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Favor Group Name</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="My Awesome Favor Group" {...field}/>
              </FormControl>
              <FormDescription>
                This is your new Favor Group's name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-auto mt-[32px]">Create Favor Group</Button>
      </form>
    </Form>
  )
}