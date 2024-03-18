"use client"

import { Calendar } from "@/components/ui/calendar"
import { useSession } from "next-auth/react"


const Points = () => {
  const { data: session, status } = useSession();
  console.log(session)

  return (
    <section className="container flex-1 flex flex-col p-8">
      <h2 className="text-xl text-primary font-semibold border-b-2 w-full">Daily Check-In</h2>
      <Calendar
        disableNavigation
        showOutsideDays={false}
        formatters={{
          formatDay: (date) => <div className={`${session?.user.activeDays.includes(date.toISOString().split('T')[0]) ? 'bg-primary/90 rounded-md' : ''} size-9 p-0 font-normal flex items-center justify-center aria-selected:opacity-100 text-center text-sm relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20`}
          >{date.getDate()}</div>,
          formatCaption: (date) => 
          <div className="flex-1 flex items-center justify-between">
            <span>{date.toLocaleString('default', {month: 'long', year: 'numeric'})}</span>

            <span>Streak: {session?.user.streak}</span>
          </div>
        }}
      />

      
    </section>
  )
}

export default Points