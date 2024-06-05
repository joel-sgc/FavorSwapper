"use server"

import { minimalUser } from "@/auth"
import prisma from "@/prisma/client"
import { Session } from "next-auth"
import { revalidatePath } from "next/cache"

export const removeFriend = async ({ friend, user }: { friend: minimalUser, user: Session["user"] }) => {
  try {
    const friendUser = await prisma.user.findUnique({ where: { id: friend.id } })

    await prisma.user.update({
      where: { id: friend.id },
      data: {
        friends: JSON.stringify(
          JSON.parse(friendUser?.friends ?? "[]").filter((f: minimalUser) => f.id !== user.id)
        )
      }
    })

    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: JSON.stringify(
          user.friends.filter((f: minimalUser) => f.id !== friend.id)
        )
      }
    })

    revalidatePath("/friends")
    return { status: 200, message: "Friend removed successfully" }
  } catch (error) {
    console.log(error)
    return { status: 500, message: "Internal Server Error" }
  } finally {
    prisma.$disconnect()
  }
}