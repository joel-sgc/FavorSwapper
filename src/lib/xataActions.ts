"use server"

import { revalidatePath } from "next/cache";
import { getXataClient } from "./xata";

export const updateUser = async({ id, data }: { id: string, data: any }) => {
  const xata = getXataClient();

  const status = await xata.db.nextauth_users.updateOrThrow(id, data);
  console.log(status);
  revalidatePath('/account');
}

export const uploadImage = async( formData: FormData ) => {
  const data = new FormData();
  data.append('image', formData.get('pfp') as File);

  try {
    const req = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: data,
    });

    const res = await req.json();

    return {status: 200, data: res}
  } catch (error) {
    return {status: 500, error}
  }
}

export const getFriends = async ( friends: string[] ) => {
  const xata = getXataClient();
  if (!friends) return [];

  const fullFriendsData = [];

  for (let i = 0; i < friends.length; i++) {
    const currentFriend = await xata.db.nextauth_users.read(friends[i]);

    if (!currentFriend) continue;

    fullFriendsData.push({
      id: currentFriend.id,
      username: currentFriend.username,
      name: currentFriend.name,
      image: currentFriend.image,
    });
  }

  return fullFriendsData;
}

export const addFriend = async ( id: string, username: string ) => {
  const xata = getXataClient();

  const user = await xata.db.nextauth_users.read(id);   // Find the user's info

  const newFriend = await xata.db.nextauth_users.filter({ username }).getFirst();   // Find the user we want to add as a friend
  if (!newFriend) {
    return {status: 500, error: "This person doesn't exist :("};
  }

  else if (user?.friends?.includes(newFriend?.id as string)) {
    return {status: 500, error: 'This person is already a friend!'};
  }

  else if (!user?.friends || user.friends.length === 0) {
    revalidatePath('/friends');
    await user?.update({ friends: [newFriend.id] });
  }

  else {
    await user?.update({ friends: [...user.friends, newFriend.id] });
  }
}

export const removeFriends = async ( id: string, friends: string[] ) => {
  const xata = getXataClient();

  try {
    const user = await xata.db.nextauth_users.read(id);
    const existingFriends = user?.friends;

    let filteredArray = (existingFriends as string[]).filter(item => !friends.includes(item));

    user?.update({ friends: filteredArray });

    revalidatePath('/friends');
    return { status: 200, data: filteredArray }
  } catch (error) {
    return { status: 200, error: error as string };
  }

}