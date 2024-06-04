"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { minimalUser } from "@/auth";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";

export const favorFormSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  favorPoints: z.coerce.number().int().min(1).max(100).finite().nonnegative(),
  dueDate: z.date(),
  receiverId: z.string().cuid(),
})

export const FavorForm = ({ friends, className, ...props }: { friends?: minimalUser[] ,className?: string }) => {
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  const favorRecipients = friends?.map((friend) => ({ label: friend.name, value: friend.id }))

  const form = useForm<z.infer<typeof favorFormSchema>>({
    resolver: zodResolver (favorFormSchema),
    defaultValues: {
      title: "",
      description: "",
      favorPoints: 1,
      dueDate: new Date(),
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
      <form id="profile-form" name="profile-form" onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-4 text-start", className)}>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Favor Request Title" {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea disabled={loading} placeholder="Favor Request Description" {...field} />
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
          name="favorPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favor Value</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="1-100" {...field} />
              </FormControl>
              <FormDescription>
                This is your email address.
              </FormDescription>
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

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
          name="receiverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUserSelect}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? friends?.find((friend) => friend?.id === field.value)?.name
                        : "Select favor recipient..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {favorRecipients?.map((friend) => (
                          <CommandItem
                            value={friend.label}
                            key={friend.value}
                            onSelect={() => {
                              form.setValue("receiverId", friend.value);
                              setOpenUserSelect(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                friend.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {friend.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                This is your Instagram username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />       
      </form>
    </Form>
  )
}