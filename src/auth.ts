import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession } from "next-auth"
import google from "next-auth/providers/google"
import nodemailer from "next-auth/providers/nodemailer"
import prisma from "./prisma/client"

type socials = {
  tiktok: string,
  instagram: string,
  twitter: string
}

type favor = {
  id: string
  title: string
  description: string
  favorValue: number
  dueDate: Date
  createdAt: Date
  sender: minimalUser
  receiver?: minimalUser
  groupId?: string
}

// type favorGroup = {
//   id: string
//   name?: string
//   createdAt: Date
//   members: DefaultSession["user"][]
//   favors: favor[]
// }

export type minimalUser = {
  id: string
  name: string
  image: string
}

type minimalFavorGroup = {
  id: string
  name: string
}

export type friendRequest = {
  id: string
  sender: minimalUser
  receiver: minimalUser
  createdAt: Date
  updatedAt: Date
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
}

declare module "next-auth" {
  interface Session {
    user: {
      username: string,
      activeDaysHistory: Date[],
      favorPoints: number,
      
      // Parsed sets
      friends: minimalUser[]
      socials: socials,
      favorGroups: minimalFavorGroup[]

      sentFavors: favor[]
      receivedFavors: favor[]
      sentFriendRequests: friendRequest[]
      receivedFriendRequests: friendRequest[]
    } & DefaultSession["user"]
  }

  interface User {
    username: string,
    activeDaysHistory: Date[],
    favorPoints: number,
    
    // Stringified
    favorGroups: string     // Array of group ids and names
    sentFavors: string      // Array of favors
    receivedFavors: string  // Array of favors
    socials: string,        // Object with socials
    friends: string         // Array of user IDs, names, and profile pictures
    sentFriendRequests: string
    receivedFriendRequests: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    google({
      allowDangerousEmailAccountLinking: true
    }),
    nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ],
  pages: {
    signIn: '/auth/login'
  },
  events: {
    // Automatically assigns a username based on the user's email address
    createUser: async (message) => {
      await prisma.user.update({
        where: { email: message.user.email as string },
        data: { username: message.user.email?.split('@')[0].toLowerCase() as string }
      });
    },

    // Automatically parses strings into an object
    session: async (message) => {
      message.session.user.socials = JSON.parse(message.session.user?.socials ?? '{"tiktok":"","instagram":"","twitter":""}');
      message.session.user.friends = JSON.parse(message.session.user?.friends ?? '[]');
      message.session.user.favorGroups = JSON.parse(message.session.user.favorGroups ?? "[]")

      message.session.user.sentFavors = JSON.parse(message.session.user.sentFavors ?? "[]")
      message.session.user.receivedFavors = JSON.parse(message.session.user.receivedFavors ?? "[]")

      message.session.user.sentFriendRequests = JSON.parse(message.session.user.sentFriendRequests ?? "[]")
      message.session.user.receivedFriendRequests = JSON.parse(message.session.user.receivedFriendRequests ?? "[]")
    }
  },
})