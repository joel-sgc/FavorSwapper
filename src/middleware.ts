import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const authPages = [
  '/auth/login'
];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('authjs.session-token');
  const pathname = request.nextUrl.pathname;

  // If there's no session cookie and the path is not an auth page, redirect to login
  if (!sessionCookie && !authPages.includes(pathname) && pathname !== '/logo.svg') {
    return NextResponse.redirect(`${process.env.BASE_URL}/auth/login`);
  }

  if (sessionCookie && authPages.includes(pathname)) {
    return NextResponse.redirect(`${process.env.BASE_URL}/`)
  }
  
  // Allow the request to proceed if it has a session cookie or is on an auth page
  return NextResponse.next();
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};