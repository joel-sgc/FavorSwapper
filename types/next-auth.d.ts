import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
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
    socials: {
      instagram: string,
      tiktok: string,
      twitter: string
    }
  }
}