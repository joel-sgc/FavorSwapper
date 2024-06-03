"use client"
 
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { useState } from "react";
import { UpdateUser } from "@/lib/updateUser";
import { toast } from "sonner";

export const profileFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().readonly(),
  username: z.string().trim().toLowerCase()
             .min(2, { message: 'Username must be at least 2 characters long.' })
             .max(20, { message: 'Username must be at most 20 characters long.' }),

  tiktok:     z.string().trim().toLowerCase().optional().transform(value => value?.toLowerCase().trim().replace(/[^a-z0-9._]+/g, '')),
  instagram:  z.string().trim().toLowerCase().optional().transform(value => value?.toLowerCase().trim().replace(/[^a-z0-9._]+/g, '')),
  twitter:    z.string().trim().toLowerCase().optional().transform(value => value?.toLowerCase().trim().replace(/[^a-z0-9_]+/g,  ''))
})

export const ProfileForm = ({ user }: { user?: Session["user"] }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver (profileFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      
      tiktok: user?.socials.tiktok ?? "",
      instagram: user?.socials.instagram ?? "",
      twitter: user?.socials.twitter ?? "",
    },
  });

  function normalizeUsername( value: string, regex: RegExp, max: number) {
    return value.toLowerCase().trim().split(' ').join('').replace(regex, '').slice(0, max)
  }

  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    setLoading(true);
    const res = await UpdateUser(user?.email as string, data);
    setLoading(false);

    if (res.status === 200) {
      toast.success('Profile updated successfully.');
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>

      <CardContent>

        <Form {...form}>
          <form id="profile-form" name="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 grid-cols-2">
            <div className="col-span-2">
              <img src={user?.image as string} alt='Profile picture' className="w-2/3 mx-auto aspect-square text-center italic leading-[100px] rounded-full border-2"/>

              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <Input disabled={loading} type="file" name="image" />
                <p className="text-sm text-muted-foreground">This is your Profile Picture.</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="john_doe" {...field} onChange={(event) => {field.onChange(normalizeUsername(event.currentTarget.value, /[^a-z0-9._]+/g, 20))}}/>
                  </FormControl>
                  <FormDescription>
                    This is your unique username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@email.com" readOnly disabled {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2 col-span-2">
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="@johndoe" {...field} onChange={(event) => {field.onChange(normalizeUsername(event.currentTarget.value, /[^a-z0-9._]+/g, 24))}}/>
                    </FormControl>
                    <FormDescription>
                      This is your TikTok username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="@johndoe" {...field} onChange={(event) => {field.onChange(normalizeUsername(event.currentTarget.value, /[^a-z0-9._]+/g, 30))}}/>
                    </FormControl>
                    <FormDescription>
                      This is your Instagram username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="@johndoe" {...field} onChange={(event) => {field.onChange(normalizeUsername(event.currentTarget.value, /[^a-z0-9_]+/g, 15))}}/>
                    </FormControl>
                    <FormDescription>
                      This is your Twitter username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            
          </form>
        </Form>
      </CardContent>

      <CardFooter className="justify-between">
        <Button disabled={loading} variant='destructive' onClick={() => form.reset()}>Cancel</Button>
        <Button form='profile-form' type="submit" disabled={loading}>Save</Button>
      </CardFooter>
    </Card>
  )
}