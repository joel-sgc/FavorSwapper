"use server"

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateUser = async({ userID, data, url }: { userID: string, data: any, url: string }) => {
  try {
    const prisma = new PrismaClient()

    await prisma.user.update({
      where: { id: userID },
      data
    })

    revalidatePath(url);
    return { status: 200 }
  } catch (error) {
    console.log(error)
    return { status: 500, error: JSON.stringify(error) };
  }
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

    return { status: 200, data: res }
  } catch (error) {
    return { status: 500, error: error as string}
  }
}

export const getFriends = async ( friends: string[] ) => {
  if (!friends) return [];

  const prisma = new PrismaClient();

  const fullFriendsData = await prisma.user.findMany({
    where: { id: 
      { in: friends }
    },
    select: {
      id: true,
      username: true,
      name: true,
      image: true
    }
  });

  return fullFriendsData;
}

export const addFriend = async ( id: string, username: string ) => {
  try {
    const prisma = new PrismaClient();

    const newFriendID = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true
      }
    })

    if (!newFriendID) {
      return { status: 500, error: "This person doesn't exist :(" };
    } 

    const currentFriends = JSON.parse((await prisma.user.findFirst({
      where: { id },
      select: {
        friends: true
      }
    }))?.friends as unknown as string)


    if (currentFriends.includes(newFriendID.id)) {
      return { status: 500, error: 'This person is already a friend!' };
    }

    await prisma.user.update({
      where: { id },
      data: {
        friends: JSON.stringify([...currentFriends, newFriendID.id])
      }
    })

    revalidatePath('/friends');
    return { status: 200, message: 'Favor Friend Added Successfuly!' }
  } catch (error) {
    console.log(error)
    return { status: 500, error: JSON.stringify(error) }
  }
}

export const removeFriends = async ( id: string, friends: string[] ) => {
  const prisma = new PrismaClient();

  try {
    const currentFriends = JSON.parse(await prisma.user.findFirst({
      where: { id },
      select: {
        friends: true
      }
    }) as unknown as string).friends

    await prisma.user.update({
      where: { id },
      data: {
        friends: JSON.stringify(currentFriends.filter((item: string) => !friends.includes(item)))
      }
    })

    revalidatePath('/friends');
    return { status: 200, data: currentFriends.filter((item: string) => !friends.includes(item))}
  } catch (error) {
    return { status: 500, error: JSON.stringify(error) };
  }
}