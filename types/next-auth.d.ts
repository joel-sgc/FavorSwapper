import { socials } from "@/drizzle/schema";
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string,
      username: string,
      favorPoints: number,
      name: string,
      email: string,
      image: string,
      friends: string[],
      socials: socials,
      activeDays: string[]
      streak: number
    }
  }

  interface User {
    username: string,
    friends: string,
    favorPoints: number,
    socials: string,
    activeDays: string,
    streak: number
  }
}