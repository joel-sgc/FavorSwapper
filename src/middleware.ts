import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const authPages = [
  '/auth/login'
];

export function middleware(request: NextRequest) {
  let sessionCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME as string);


  const pathname = request.nextUrl.pathname;

  // If there's no session cookie and the path is not an auth page, redirect to login (also ignore logo loading)
  if (!sessionCookie && !authPages.includes(pathname) && pathname !== '/logo.svg') {
    return NextResponse.redirect(`${process.env.BASE_URL}/auth/login`);
  }

  // If there's a session cookie and the path is an auth page, redirect to home
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