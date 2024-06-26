"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteImage } from "@/lib/imageActions";
import { updateGroup } from "@/lib/groupActions";
import { Button } from "@/components/ui/button";
import { groupFormSchema } from "../group-form";
import { Input } from "@/components/ui/input";
import { FavorGroup } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const EditGroup = ({ user, group, ...props }: { user: Session["user"], group?: FavorGroup | null }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof groupFormSchema>>({
    resolver: zodResolver (groupFormSchema),
    defaultValues: {
      name: group?.name as string,
      image: "",
    },
  });

  async function onSubmit(data: z.infer<typeof groupFormSchema>) {
    try {
      setLoading(true);
      let image;

      if (file) {
        const formData = new FormData();
        formData.set('file', file);
        formData.append('tags', 'group_picture');
        
        const req = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        const uploadRes = await req.json()
        image = uploadRes.data;

        // Delete old image
        await deleteImage(group?.id as string, "group");
      }

      const res = await updateGroup({ groupId: group?.id as string, data: { name: data.name, ...image }, user });
      setLoading(false);

      if (res.status === 200) {
        toast.success(res.message);
        setOpen(false);
        setFile(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(JSON.stringify(error));
    }
  }

  const verifyFileSize = (file: File) => {
    if (file.size / (1000000) > 4) {
      return form.setError('image', { type: 'custom', message: 'File size must be less than 4MB.'});
    } else {
      form.clearErrors('image');
      setFile(file);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-1.5 px-2 text-sm cursor-default select-none">Edit Group</DialogTrigger>
      <DialogContent className="w-max max-w-[90dvw]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Favor Group Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} autoComplete="off" placeholder="My Awesome Favor Group" {...field}/>
                  </FormControl>
                  <FormDescription>
                    This is your Favor Group's name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Favor Group Image</FormLabel>
                  <FormControl>
                    <ImageUpload disabled={loading} {...field} file={file} onChange={(e) => verifyFileSize((e.target.files as FileList)[0])}/>
                  </FormControl>
                  <FormDescription>
                    This is your Favor Group's image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-2 mt-2">
              <DialogClose asChild><Button disabled={loading} variant='destructive' className="w-fit" onClick={() => form.reset()}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={loading} className="w-fit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}