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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

export const FavorForm = ({ user, friend, group, className, ...props }: { user: Session["user"], friend?: minimalUser, group?: FavorGroup, className?: string }) => {
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  const favorFormSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(2).max(500),
    favorPoints: z.coerce.number().int().min(1).finite().nonnegative(),
    dueDate: z.date().min(new Date()),
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
    const res = {status: 200, message: ''}
    setLoading(false);

    if (res.status === 200) {
      toast.success('Profile updated successfully.');
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
                <Input disabled={loading} placeholder="Favor Request Title" {...field} />
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
                <Textarea disabled={loading} placeholder="Favor Request Description" {...field} />
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
                      onSelect={field.onChange}
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
                      className="w-full justify-between"
                    >
                      {!group ? (
                        field.value
                          ? user.friends?.find((friend) => friend?.id === field.value)?.name
                          : "Select favor recipient..."
                      ) : group.name}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search Favor Friends..." />
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