import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { removeFriend, sendFriendReq } from "@/lib/friendActions";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, socials } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";
import Link from "next/link";

const ProfilePage = async ({ params }: { params: { id: string }}) => {
  const session = await auth();

  const user = await prisma.user.findUnique({ where: { id: params.id }});
  const socials = JSON.parse(user?.socials as string) as socials;

  const alreadyFriends = session?.user.friends.some((friend) => friend.id === params.id);
  const alreadySentFriendReq = session?.user.sentFriendRequests.some((req) => req.sender.id === session?.user?.id && req.receiver.id === user?.id);

  if (!user) redirect('/');

  return (
    <main className="flex-1 flex flex-col gap-4 pb-[72px]">
      <div className="w-full bg-secondary h-24"/>
      <div className="flex flex-col items-center px-4">
        <Avatar className="size-32 -mt-12 mb-2 bg-card">
          <AvatarImage src={user.image as string} alt="" aria-hidden referrerPolicy="no-referrer"/>
          <AvatarFallback>{(user?.name as string).substring(0,1).trim()}</AvatarFallback>
        </Avatar>

        <h1 className="text-2xl font-bold">{user.name}</h1>
        <h2 className="text-lg text-gray-500">@{user.username}</h2>

        <div className="flex justify-evenly items-center gap-2 w-full max-w-[50vw]">
          {/* TIKTOK */}
          {socials.tiktok && (
            <Link href={`https://tiktok.com/${socials.tiktok}`} target="_blank" className="my-4">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-8 fill-white">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </Link>
          )}
          
          {/* INSTAGRAM */}
          {socials.instagram && (
            <Link href={`https://instagram.com/${socials.instagram}`} target="_blank" className="my-4">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-8 fill-white">
                <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
              </svg>
            </Link>
          )}

          {/* TWITTER / X */}
          {socials.twitter && (
            <Link href={`https://x.com/${socials.twitter}`} target="_blank" className="my-4">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-8 fill-white">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
            </Link>
          )}
        </div>

        {alreadySentFriendReq ? (
          <div className="h-10 bg-secondary px-4 py-2 rounded-md text-sm font-medium mt-2">Friend Request Pending</div>
        ) : (
          <form className="mt-2" action={async () => {
            "use server"
            if (alreadyFriends) {
              await removeFriend({
                friend: {
                  id: user.id,
                  name: user.name as string,
                  username: user.username as string,
                  image: user.image as string
                },
                user: session?.user as Session["user"]
              });
            } else {
              await sendFriendReq( user.username as string, session?.user as Session["user"] );
            }
  
            revalidatePath('/', 'layout');
          }}>
            <Button variant={alreadyFriends ? 'secondary' : 'default'}>{alreadyFriends ? 'Remove Friend' : 'Send Friend Request'}</Button>
          </form>
        )}

        <hr className="w-full mt-4"/>
      </div>
    </main>
  )
}

export default ProfilePage;