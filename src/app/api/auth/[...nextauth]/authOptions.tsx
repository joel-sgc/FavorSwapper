import { XataAdapter } from "@next-auth/xata-adapter";
import GoogleProvider from 'next-auth/providers/google'
import { XataClient, getXataClient } from '@/lib/xata';
import { AuthOptions } from "next-auth";


const client = new XataClient();


export const authOptions: AuthOptions = {
  adapter: XataAdapter(client),
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
      session.user.username = user.username;
      session.user.socials = user.socials;
      session.user.favorPoints = user.favorPoints
      session.user.id = user.id;
      return session;
    },
    async signIn({ user }) {
      const xata = getXataClient();

      const dbUser = await xata.db.nextauth_users.read(user.id);
      if (dbUser?.username === null) {
        // Set username to their email by default
        await xata.db.nextauth_users.updateOrThrow(user.id, {username: user.email});
      }
      
      return true;
    }
  }
}