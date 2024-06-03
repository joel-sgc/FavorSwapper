"use server"
import { createId } from '@paralleldrive/cuid2';
import prisma from "@/prisma/client";
import { friendRequest } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Session, User } from 'next-auth';

export const sendFriendReq = async (username: string, user: Session["user"]) => {
  try {
    const newFriend = await prisma.user.findUnique({ where: { username }});

    // Check if they already have a pending friend request from the user
    if (user.receivedFriendRequests.some((req: friendRequest) => req.sender.id === newFriend?.id && req.status === 'PENDING')) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          receivedFriendRequests: JSON.stringify(
            user.receivedFriendRequests.map((req: friendRequest) => {
              if (req.sender.id === newFriend?.id && req.status === 'PENDING') return;
              return req;
            })
          ),
          friends: JSON.stringify([
            ...user.friends,
            {
              id: newFriend?.id,
              name: newFriend?.name,
              image: newFriend?.image
            }
          ])
        }
      })

      await prisma.user.update({
        where: { username },
        data: {
          sentFriendRequests: JSON.stringify(
            (JSON.parse(newFriend?.sentFriendRequests ?? "[]") as unknown as friendRequest[]).map((req: friendRequest) => {
              if (req.sender.id === user.id && req.status === 'PENDING') return undefined;
              return req;
            }).filter((req?: friendRequest) => req !== undefined)
          ),
          friends: JSON.stringify([
            ...JSON.parse(newFriend?.friends ?? "[]"),
            {
              id: user.id,
              name: user.name,
              image: user.image
            }
          ])
        }
      })

      revalidatePath('/friends')
      return { status: 200, message: 'Friend request accepted.' }
    }


    const friendReq = {
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'PENDING'
    }

    // Update the friend's receivedFriendRequests
    await prisma.user.update({
      where: { username }, 
      data: {
        receivedFriendRequests: JSON.stringify([
          ...JSON.parse(newFriend?.receivedFriendRequests ?? "[]"),
          {
            ...friendReq,
            sender: {
              id: user.id,
              name: user.name,
              image: user.image
            },
            receiver: {
              id: newFriend?.id,
              name: newFriend?.name,
              image: newFriend?.image
            },
          }
        ])
      } 
    })

    // Update the user's sentFriendRequests
    await prisma.user.update({
      where: { id: user.id }, 
      data: {
        sentFriendRequests: JSON.stringify([
          ...user.sentFriendRequests,
          {
            ...friendReq,
            sender: {
              id: newFriend?.id,
              name: newFriend?.name,
              image: newFriend?.image
            },
            receiver: {
              id: user.id,
              name: user.name,
              image: user.image
            }
          }
        ])
      } 
    })

    revalidatePath('/friends')
  
    return { status: 200, message: 'Friend request sent.' }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Failed to send friend request.' }
  } finally {
    prisma.$disconnect()
  }
}