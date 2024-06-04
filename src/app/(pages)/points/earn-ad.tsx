import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const EarnAd = async ({ adReward }: { adReward: number }) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earn Points</CardTitle>
        <CardDescription>Watch an ad to earn {adReward} point.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full">Watch Ad</Button>
      </CardContent>
    </Card>
  )
}