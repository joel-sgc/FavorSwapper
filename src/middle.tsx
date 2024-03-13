import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req, res) {
    if (req.nextauth.token) return NextResponse.redirect(new URL('/'))
  },
  {
    pages: {
      signIn: '/api/auth/signIn',
    },
  }
)

// export const config = {
//   matcher: ['/', '/account', '/api/auth/signIn'],
// }