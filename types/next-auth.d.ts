import NextAuth from "next-auth"

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
      socials: {
        instagram: string,
        tiktok: string,
        twitter: string
      }
    }
  }

  interface User {
    username: string,
    favorPoints: number,
    socials: {
      instagram: string,
      tiktok: string,
      twitter: string
    }
  }
}