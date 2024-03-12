import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { XataClient } from '@/lib/xata';
import { XataAdapter } from "@next-auth/xata-adapter";

const client = new XataClient();
export const authOptions: AuthOptions = {
  adapter: XataAdapter(client),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.socials = user.socials;
      session.user.id = user.id;
      return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }