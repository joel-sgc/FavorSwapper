import { PageTitle } from "@/components/page-title";
import { DailyCheckin } from "./daily-checkin";
import { Coins } from "lucide-react";
import { EarnAd } from "./earn-ad";
import { auth } from "@/auth";

const PointsPage = async () => {
  const session = await auth();

  const activeDays = session?.user.activeDaysHistory.filter((date) => new Date(date).getMonth() === new Date().getMonth()) as Date[];
  let streak = 1;
  let adReward = 0;

  // Calculate streak
  for (let i = activeDays.length-1; i >= 1; i--) {
    let timeDiff = new Date(activeDays[i]).getTime() - new Date(activeDays[i-1]).getTime();
    let daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 2) {
      streak++;
    } else {
      break;
    }
  }

  if (streak < 7) {
    adReward = 1;
  } else if (streak < 28) {
    adReward = 2;
  } else {
    adReward = 3;
  }

  const activeDaysThisMonth = session?.user.activeDaysHistory.filter((date) => new Date(date).getMonth() === new Date().getMonth()) as Date[];
  const activityPercentage = Math.round(((activeDaysThisMonth.length / new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()) * 100) * 100) / 100;

  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <Coins size={32} />
        <h1>Earn Favor Points</h1>
      </PageTitle>

      <DailyCheckin
        session={session}
        streak={streak}
        activeDaysThisMonth={activeDaysThisMonth}
        activityPercentage={activityPercentage}
      />

      <EarnAd adReward={adReward} />
    </main>
  )
}

export default PointsPage