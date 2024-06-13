"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FavorGroup } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { minimalUser } from "@/auth";
import { Session } from "next-auth";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { cn, minifyUser } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";
import { sendFavorReq } from "@/lib/sendFavorReq";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";

export const FavorForm = ({ user, friend, group, setOpen, className, ...props }: { user: Session["user"], friend?: minimalUser, group?: FavorGroup, setOpen?: Dispatch<SetStateAction<boolean>>, className?: string }) => {
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  const favorFormSchema = z.object({
    id: z.string().cuid2().optional(),
    title: z.string().min(2).max(100),
    description: z.string().min(2).max(500),
    favorPoints: z.coerce.number().int().min(1).finite().nonnegative(),
    dueDate: z.date(),
    receiverId: z.string().cuid(),
  })

  const form = useForm<z.infer<typeof favorFormSchema>>({
    resolver: zodResolver (favorFormSchema),
    defaultValues: {
      title: "",
      description: "",
      favorPoints: 1,
      dueDate: new Date(),
      receiverId: friend?.id || group?.id || "",
    },
  });


  async function onSubmit(data: z.infer<typeof favorFormSchema>) {
    setLoading(true);
    const res = await sendFavorReq({
      favor: {
        id: "",
        createdAt: new Date(),
        title: data.title,
        description: data.description,
        favorValue: data.favorPoints,
        dueDate: data.dueDate,
        receiver: friend,
        groupId: group?.id,
        sender: minifyUser(user) as minimalUser
      },
      user
    })
    setLoading(false);

    if (res.status === 200) {
      if (setOpen) setOpen(false);
      toast.success('Profile updated successfully.');
      form.reset();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Form {...form}>
      <form {...props} onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-4 text-start", className)}>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favor Title</FormLabel>
              <FormControl>
                <Input disabled={loading} autoComplete="off" placeholder="Favor Request Title" {...field} />
              </FormControl>
              <FormDescription>A brief title for the favor you are requesting.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favor Description</FormLabel>
              <FormControl>
                <Textarea disabled={loading} autoComplete="off" placeholder="Favor Request Description" {...field} />
              </FormControl>
              <FormDescription>A detailed description of what you need help with.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="favorPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favor Value</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  type="tel"
                  placeholder="1-100"
                  autoComplete="off"
                  {...field} 
                  onChange={(event) => {
                    const value = Number(event.currentTarget.value.match(/\d/g)?.join(''))
                    const constrainedValue = Math.min(user.favorPoints, Math.max(1, value))

                    if (Number.isNaN(constrainedValue)) field.onChange(0)
                    else field.onChange(constrainedValue)
                  }}
                  /> 
              </FormControl>
              <FormDescription>The amount of favor points allocated to this request. Must be within your available balance.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favor Due Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-min ml-2">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => e && field.onChange(e)}
                      modifiers={{
                        disabled: [
                          { before: new Date() },
                        ]
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>The date by which the favor needs to be completed. Penalty points will be deducted if not completed by this date.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favor Recipient</FormLabel>
              <FormControl>
                <Popover open={(group ? false : openUserSelect) as boolean} onOpenChange={setOpenUserSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUserSelect}
                      className="w-full"
                    >
                      {!group ? (
                        field.value
                          ? (
                            user.friends?.filter((friend) => friend?.id === field.value)?.map((friend) => (
                              <>
                                <img alt="" aria-hidden src={friend.image} referrerPolicy="no-referrer" className="size-7 rounded-full border bg-card mr-2"/>
                                {friend.name}
                              </>
                            ))
                          ) : "Select favor recipient..."
                      ) : group.name}
                      <ChevronsUpDown className="h-4 w-4 ml-auto shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput autoComplete="off" autoFocus={false} placeholder="Search Favor Friends..." />
                      <CommandEmpty>No Favor Friends found :&#40;</CommandEmpty>
                      <CommandGroup>
                        {user.friends?.map((friend) => (
                          <CommandItem
                            value={friend.name}
                            key={friend.id}
                            onSelect={() => {
                              form.setValue("receiverId", friend.id);
                              setOpenUserSelect(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                friend.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <img alt="" aria-hidden src={friend.image} referrerPolicy="no-referrer" className="size-8 rounded-full mr-2"/>
                            {friend.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>The name of the {group ? 'Favor Group' : 'Favor Friend'} you are asking to do the favor.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">Submit</Button>
      </form>
    </Form>
  )
}

export const FavorFormDrawer = ({ user, friend, group, children, className, ...props }: { user: Session["user"], friend?: minimalUser, group?: FavorGroup, children: ReactNode, className?: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger {...props} className={className}>{children}</DrawerTrigger>
      <DrawerContent className="p-4 max-h-[90dvh]">
        <ScrollArea className="overflow-auto h-full max-h-[calc(90dvh-48px)]">
          <FavorForm group={group} setOpen={setOpen} user={user} friend={friend} className="mx-2 my-[6px]"/>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}