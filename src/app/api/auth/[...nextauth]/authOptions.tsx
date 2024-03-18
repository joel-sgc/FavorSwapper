import GoogleProvider from 'next-auth/providers/google';
import type { Adapter } from "next-auth/adapters";
import { AuthOptions } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { Prisma, PrismaClient } from "@prisma/client";
import { getPrismaClient } from '@/prisma/client';
import { getDateDifference } from '@/lib/utils';

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma) as Adapter,
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: ({ ...data }) => {
      data.username = data.name?.trim().replaceAll(' ', '_').toLocaleLowerCase() as string;
      data.socials = JSON.stringify({ instagram: '', twitter: '', tiktok: '' })

      return prisma.user.create({ data: data as ((Prisma.Without<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> & Prisma.UserUncheckedCreateInput) | (Prisma.Without<Prisma.UserUncheckedCreateInput, Prisma.UserCreateInput> & Prisma.UserCreateInput)) })
    },
  } as Adapter,

  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  pages: {
    signIn: '/api/auth/signIn'
  },
  callbacks: {
    async session({ session, user, token }) {
      session.user.favorPoints = user.favorPoints;
      session.user.username = user.username;
      session.user.friends = (JSON.parse(user.friends) || []);
      session.user.socials = (JSON.parse(user.socials) || {"instagram":"","twitter":"","tiktok":""});
      session.user.activeDays = JSON.parse(user.activeDays || "[]");
      session.user.streak = user.streak;
      session.user.id = user.id;


      // For offline testing purposes
      if (!user) return {
        user: {
          id: 'cltvmn68z0007u5ccv4wt5ufu',
          name: 'Tester Account',
          email: 'test@test.test',
          image: 'https://dacs.vercel.app/Andy.svg',

          favorPoints: 9999,
          username: 'testerAccount',
          friends: [],
          socials: {"instagram":"@test","twitter":"@test","tiktok":"@test"},
          activeDays: []
        },
        expires: "2024-03-19T19:51:45.082Z"
      }


      // Daily login-cycle
      // Explanation: The array will cover at most 28 days, the current date included. It'll check when the oldest date recorded was, using the YYYY-MM-DD format.
      // We then use JavaScript's .filter method to keep only dates that are within the 28 days range. Based on how many entries exist after the filtering, we'll know how many extra favor points to award.

      // 1-6 days: 1 favor point
      // 1-3 weeks: 2 favor points
      // 4 weeks: 3 favor points

      // To get the YYYY-MM-DD format, use "new Date.toISOString().split('T')[0]"

      // Checking if we already did this today
      const currentDate = new Date()
      const dates = (JSON.parse(user.activeDays || "[]") as string[]);
      
      // If haven't checked in
      if (dates.length === 0) {
        const prisma = new PrismaClient();

        await prisma.user.update({
          where: { id: user.id },
          data: {
            activeDays: JSON.stringify([currentDate.toISOString().split('T')[0]]),
            favorPoints: session.user.favorPoints + 1
          }
        })

        session.user.favorPoints + user.favorPoints + 1;
        return session;
      }

      else if (currentDate.toISOString().split('T')[0] === new Date(dates[dates.length - 1]).toISOString().split('T')[0]) return session;

      // Filtering data so we only story up to 28 days max (including today)
      const filteredActiveDates = [...dates, currentDate.toISOString().split('T')[0]].filter(unfilteredDate => {
        const date = new Date(unfilteredDate)

        return getDateDifference(date, currentDate) <= 28;
      })

      // Daily login streak logic;
      const streakCheck = new Date(dates[dates.length-1]);
      if (streakCheck.setDate(streakCheck.getDate() + 1) === currentDate.getDate()) {
        // If the last time we checked in was yesterday
        console.log('streak increased')
        session.user.streak = user.streak + 1;
      }


      if (filteredActiveDates.length < 2) {
        session.user.favorPoints = user.favorPoints + 1;
      } else if (filteredActiveDates.length < 3) {
        session.user.favorPoints = user.favorPoints + 2;
      } else {
        session.user.favorPoints = user.favorPoints + 3;
      }

      // Sending updated data to Prisma
      await prisma.user.update({
        where: { id: user.id },
        data: {
          activeDays: JSON.stringify(filteredActiveDates),
          favorPoints: session.user.favorPoints,
          streak: session.user.streak
        }
      })

      return session;
    }
  }
}