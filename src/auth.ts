import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import google from "next-auth/providers/google"
import nodemailer from "next-auth/providers/nodemailer"

declare module "next-auth" {
  interface Session {
    user: {
      favorPoints: number,
      socials: string,
      activeDaysHistory: Date[]
    } & DefaultSession["user"]
  }
}

const prisma = new PrismaClient() 

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
})