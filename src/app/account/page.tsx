"use client"

import { Label } from "@/components/ui/label";
import { Input, InputProps, TrailingInput } from "@/components/ui/input";
import { LabelProps } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { updateUser, uploadImage } from "@/lib/xataActions";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

type changesType = {
  username?: string | null,
  name?: string | null,
  image?: string,
  socials?: {
    instagram?: string | null,
    tiktok?: string | null,
    twitter?: string | null
  } | any
}

const Account = () => {
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pfpPreview, setPfpPreview] = useState('');

  const changeProfile = async( e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Store only any changes, not anything that stayed the same
    const changes: changesType = {
      name: (formData.get('name') as string).trim(),
      username: (formData.get('username') as string).trim().toLocaleLowerCase(),
      image: '',
      socials: {
        instagram: (formData.get('instagram') as string).trim(),
        tiktok: (formData.get('tiktok') as string).trim(),
        twitter: (formData.get('twitter') as string).trim()
      }
    }

    // Check basic info
    if (changes.name?.length === 0 || changes.name === session?.user.name) delete changes.name;
    if (changes.username?.length === 0 || changes.username === session?.user.username || changes.username === session?.user.email) delete changes.username;
    
    // Check socials
    if (changes.socials?.instagram === session?.user.socials.instagram) delete changes.socials?.instagram;
    if (changes.socials?.tiktok === session?.user.socials.tiktok) delete changes.socials?.tiktok;
    if (changes.socials?.twitter === session?.user.socials.twitter) delete changes.socials?.twitter;
    
    if (Object.keys(changes.socials).length === 0) {
      delete changes.socials;
    }
    
    // If image upload, send to imgBB
    if ((formData.get('pfp') as File).size !== 0) {
      formData.delete('name');
      formData.delete('instagram');
      formData.delete('tiktok');
      formData.delete('twitter');
      
      const status = (await uploadImage(formData)).data.thumb.url;
      if (status === 500) {
        setLoading(false);
        setError(status.error);
        return toast.error("Something went wrong! Please try again.");
      }
    } else {
      delete changes.image;
    }

    // If no changes, stop
    if (Object.keys(changes || {}).length === 0) return;

    // Send data to Xata.io
    await updateUser({id: session?.user.id as string, data: changes});
    setLoading(false);
    toast.success("Account updated successfully!");
    revalidatePath('/account')
  }

  return (
    <>
      <section className="container pt-4 flex-1 flex flex-col">   {/*  Profile Settings  */}
        <SectionHeader main_label="Profile" secondary_label="This is how others will see you on the site."/>
        <hr className="my-8"/>

        <form onSubmit={(e) => changeProfile(e)} className="flex-1 flex flex-col gap-8">
          <div className="flex-1 flex flex-col gap-8">
            <div className="grid gap-2 text-ellipsis">
              <div className="flex items-center justify-between">
                <img src={session?.user?.image as string} className="size-24 rounded-full border-2"/>

                <ArrowRight className={pfpPreview.length > 0 ? 'block' : 'hidden'} size={32}/>

                <img src={pfpPreview} className={`size-24 rounded-full border-2 ${pfpPreview.length > 0 ? 'block' : 'hidden'}`}/>
              </div>

              <Input
                accept="image/*"
                disabled={loading}
                name="pfp"
                type="file"
                onChange={(e) => {
                  if (e.target.files?.length === 0 || e.target.files === null) return;
                  
                  // If file is over 5MB, send error. Otherwise allow it
                  if ((e.target?.files[0].size/1024)/1024 > 6) {
                    e.target.value = '';  // Reset value
                    return setError('Profile picture too large, your profile picture should be 5MB or under.');
                  } else {
                    const reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);

                    reader.onloadend = () => {
                      setPfpPreview(reader.result as string);
                    }
                    setError('');
                  }
                }}
              />
            </div>

            <InputLabel label="Username" inputProps={{placeholder: session?.user?.username as string, name: 'username', disabled: loading, defaultValue: session?.user.username || session?.user.email}}/>
            <InputLabel label="Name" inputProps={{placeholder: session?.user?.name as string, name: 'name', disabled: loading, defaultValue: session?.user.name}}/>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Socials</Label>
              <TrailingInput autoComplete='off' placeholder="username" defaultValue={session?.user.socials.instagram} disabled={loading} name="instagram" trail='Instagram.com/' type="text"/>
              <TrailingInput autoComplete='off' placeholder="@username" defaultValue={session?.user.socials.tiktok} disabled={loading} name="tiktok" trail='TikTok.com/' type="text"/>
              <TrailingInput autoComplete='off' placeholder="username" defaultValue={session?.user.socials.twitter} disabled={loading} name="twitter" trail='Twitter.com/' type="text"/>
            </div>
          </div>


          <div className="grid gap-2">
            {error && <span className="text-red-500 text-md text-center mx-auto">{error}</span>}
            <Button disabled={loading} type="submit">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin"/>
                  Loading...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
        <hr className="mt-8"/>
      </section>
    </>
  )
}



const SectionHeader = ({ main_label, secondary_label, ...props }: {main_label: string, secondary_label?: string}) => (
  <h2 className="w-full text-start font-semibold text-2xl" {...props}>
    {main_label}<br/>
    <span className="text-sm text-muted-foreground font-normal">{secondary_label}</span>
  </h2>
)

const InputLabel = ({ label, labelProps, inputProps }: { label: string, labelProps?: LabelProps, inputProps?: InputProps }) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label {...labelProps}>{label}</Label>
    <Input {...inputProps} />
  </div>
)

export default Account