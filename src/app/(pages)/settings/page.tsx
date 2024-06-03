import { PageTitle } from "@/components/page-title";
import { GaugeIcon } from "lucide-react";
import { ProfileForm } from "./profile-form";
import { auth } from "@/auth";

const SettingsPage = async() => {
  const session = await auth();

  return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle>
        <GaugeIcon size={32} />
        <h1>Settings</h1>
      </PageTitle>

      <ProfileForm user={session?.user}/>
    </main>
  )
}

export default SettingsPage;