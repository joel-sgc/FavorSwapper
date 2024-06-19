import nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import google from "next-auth/providers/google";
import prisma from "./prisma/client";

export type socials = {
  tiktok: string,
  instagram: string,
  twitter: string
}

export type favor = {
  id: string
  title: string
  description: string
  favorValue: number
  dueDate: Date
  createdAt: Date
  sender: minimalUser
  receiver?: minimalUser
  groupId?: string
  ignoring?: minimalUser[]
  working?: minimalUser[]

  // For favor history
  completed?: boolean
  completedAt?: Date
  completionImage?: string
  completionImageId?: string
}

export type favorGroup = {
  id: string
  name?: string
  image?: string
  createdAt: Date
  members: minimalUser[]
  favors: favor[]
  free: boolean
  admins: minimalUser[]
}

export type minimalUser = {
  id: string
  name: string
  image: string
  username: string
}

export type minimalFavorGroup = {
  id: string
  name: string
  free: boolean
  image: string
  admins: minimalUser[]
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
      username: string
      activeDaysHistory: Date[]
      streak: number
      favorPoints: number
      imageId: string
      
      // Parsed sets
      friends: minimalUser[]
      socials: socials
      favorGroups: string[]

      sentFavors: favor[]
      receivedFavors: favor[]
      favorHistory: favor[]
      sentFriendRequests: friendRequest[]
      receivedFriendRequests: friendRequest[]
    } & DefaultSession["user"]
  }

  interface User {
    username: string
    activeDaysHistory: Date[]
    favorPoints: number
    imageId: string
    favorGroups: string[]   // Array of group IDs
    
    // Stringified
    sentFavors: string      // Array of favors
    receivedFavors: string  // Array of favors
    favorHistory: string    // Array of favors
    socials: string         // Object with socials
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
      const username = message.user.email?.split('@')[0].toLowerCase()

      await prisma.user.update({
        where: { email: message.user.email as string },
        data: { username: username?.substring(Math.min(username.length, 50)) }
      });

      message.user.username = username?.substring(Math.min(username.length, 50)) as string;
    },


    session: async (message) => {
      // Automatically parses strings into an object
      message.session.user.socials = JSON.parse(message.session.user?.socials ?? '{"tiktok":"","instagram":"","twitter":""}');
      message.session.user.friends = JSON.parse(message.session.user?.friends ?? '[]');

      message.session.user.sentFavors = JSON.parse(message.session.user.sentFavors ?? "[]");
      message.session.user.receivedFavors = JSON.parse(message.session.user.receivedFavors ?? "[]");
      message.session.user.favorHistory = JSON.parse(message.session.user.favorHistory ?? "[]");

      message.session.user.sentFriendRequests = JSON.parse(message.session.user.sentFriendRequests ?? "[]");
      message.session.user.receivedFriendRequests = JSON.parse(message.session.user.receivedFriendRequests ?? "[]");

      // Also register daily check-ins

      // 1-6 days: 1 favor point
      // 1-3 weeks: 2 favor points
      // 4 weeks: 3 favor points
      const activeDays = message.session.user.activeDaysHistory;

      // If no activity, add today to the list, then update user's data
      if (activeDays.length === 0) {
        message.session.user.activeDaysHistory.push(new Date());
        message.session.user.activeDaysHistory.sort((a, b) => a.getTime() - b.getTime());

        message.session.user.favorPoints += 1;

        await prisma.user.update({
          where: { id: message.session.user.id },
          data: {
            activeDaysHistory: { set: message.session.user.activeDaysHistory },
            favorPoints: message.session.user.favorPoints
          }
        })

        return;
      }
      

      // Since we have activity, we need to check if the user has checked in today
      const today = new Date();
      today.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      // Do nothing if the user has already checked in today
      if (activeDays.map((date) => normalizeDate(date)).includes(normalizeDate(today))) return;

      // If not, add today to the list and calculate points
      activeDays.push(today);
      activeDays.sort((a, b) => a.getTime() - b.getTime());

      // Calculate points based off most recent period in time with no check-in gaps
      let streak = 0;

      for (let i = activeDays.length-1; i >= 1; i--) {
        let timeDiff = activeDays[i].getTime() - activeDays[i-1].getTime();
        let daysDiff = timeDiff / (1000 * 3600 * 24);

        if (daysDiff < 2) {
          streak++;
        } else {
          break;
        }
      }

      // Now that we calculated the streak, we can calculate the points
      if (streak < 7) {
        message.session.user.favorPoints += 1;
      } else if (streak < 28) {
        message.session.user.favorPoints += 2;
      } else {
        message.session.user.favorPoints += 3;
      }

      // Add today (since today hasn't been calculated for), then sort the list, then update the user's data
      await prisma.user.update({
        where: { id: message.session.user.id },
        data: {
          activeDaysHistory: { set: activeDays },
          favorPoints: message.session.user.favorPoints
        }
      })

      message.session.user.streak = streak;

      return;
    }
  },
})

const normalizeDate = ( date: Date ) => date.toISOString().split('T')[0];