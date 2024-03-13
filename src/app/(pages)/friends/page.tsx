import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AddFriendForm } from "./add-friend-form";
import { getFriends } from "@/lib/xataActions";
import { getServerSession } from "next-auth";

const Friends = async () => {
  const session = await getServerSession(authOptions);
  const friends = await getFriends(session?.user.friends as string[]);

  return (
    <section className="container mt-4 grid gap-2">
      {/* ADD FRIEND */}
      <AddFriendForm id={session?.user.id as string} friends={session?.user.friends as string[]} />

      <ul>
        {friends && friends.map((friend, index) => (
          <li key={index}>{friend.name}</li>
        ))}
      </ul>
    </section>
  )
}

export default Friends;