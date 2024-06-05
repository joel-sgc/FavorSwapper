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
    if (user.receivedFriendRequests.length > 0 && user.receivedFriendRequests.some((req: friendRequest) => req.sender.id === newFriend?.id && req.status === 'PENDING')) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          receivedFriendRequests: JSON.stringify(
            user.receivedFriendRequests.map((req: friendRequest) => {
              if (req.sender.id === newFriend?.id && req.status === 'PENDING') return;
              return req;
            }).filter((req?: friendRequest) => req !== undefined && req !== null)
          ),
          friends: JSON.stringify([
            ...user.friends,
            {
              id: newFriend?.id,
              name: newFriend?.name,
              image: newFriend?.image,
              username: newFriend?.username
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
            }).filter((req?: friendRequest) => req !== undefined && req !== null)
          ),
          friends: JSON.stringify([
            ...JSON.parse(newFriend?.friends ?? "[]"),
            {
              id: user.id,
              name: user.name,
              image: user.image,
              username: user?.username
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
              image: user.image,
              username: user?.username
            },
            receiver: {
              id: newFriend?.id,
              name: newFriend?.name,
              image: newFriend?.image,
              username: newFriend?.username
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
              image: newFriend?.image,
              username: newFriend?.username
            },
            receiver: {
              id: user.id,
              name: user.name,
              image: user.image,
              username: user?.username
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

export const denyFriendReq = async (id: string, user: Session["user"]) => {
  try {
    const friendRequester = await prisma.user.findUnique({ where: { id } });

    // Update the user's receivedFriendRequests
    await prisma.user.update({
      where: { id: user.id },
      data: {
        receivedFriendRequests: JSON.stringify(
          user.receivedFriendRequests.filter((req: friendRequest) => req.sender.id !== id)
        )
      }
    });

    // Update the friend requester's sentFriendRequests
    await prisma.user.update({
      where: { id },
      data: {
        sentFriendRequests: JSON.stringify(
          (JSON.parse(friendRequester?.sentFriendRequests ?? "[]") as unknown as friendRequest[]).filter((req: friendRequest) => req.sender.id !== user.id)
        )
      }
    })

    revalidatePath('/friends')

    return { status: 200, message: 'Friend request denied.' }
  } catch (error) {
    console.log(error);
    return { status: 500, message: 'Failed to deny friend request.' }
  } finally {
    prisma.$disconnect()
  }
}