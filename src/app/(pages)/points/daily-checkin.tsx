import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityIcon, CalendarCheckIcon, StarIcon, TrophyIcon } from "lucide-react"

export const DailyCheckin = ({
  session,
  activeDaysThisMonth,
  streak,
  activityPercentage
} : {
  session: any,
  activeDaysThisMonth: Date[],
  streak: number,
  activityPercentage: number
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Check-In</CardTitle>
        <CardDescription>Review your activity and points earned for the month.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="grid gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-bold">{session?.user.favorPoints}</div>

            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <TrophyIcon className="w-4 h-4" />
              Total Points
            </div>
          </div>

          <Calendar
            mode="multiple"
            selected={session?.user.activeDaysHistory.map((date: Date) => new Date(date))}
            className="p-0 [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6 mx-auto"
          />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeDaysThisMonth.length}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <CalendarCheckIcon className="w-4 h-4" />
                Active Days
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">You've checked in {activeDaysThisMonth.length} days this month.</div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{streak}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <StarIcon className="w-4 h-4 fill-gray-500 dark:fill-gray-400" />
                Streak
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Your current check-in streak is {streak} days.</div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activityPercentage}%</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <ActivityIcon className="w-4 h-4" />
                Completion
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              You've completed {activityPercentage}% of your daily check-ins this month.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}