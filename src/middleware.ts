import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req }) => {
      const sessionToken = req.cookies.get("next-auth.session-token");
      if (sessionToken) return true;
      else return false;
    },
  },
  pages: {
    signIn: '/api/auth/signIn',
    // error: '/error',
  }
});