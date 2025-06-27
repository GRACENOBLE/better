import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // Get the full path the user was trying to access, including query params
    const intendedUrl = request.nextUrl.pathname + request.nextUrl.search;

    // Encode the URL to ensure it's safely passed as a query parameter
    const encodedIntendedUrl = encodeURIComponent(intendedUrl);

    // Redirect to the sign-in page, passing the intended URL as a query parameter
    return NextResponse.redirect(
      new URL(`/auth/sign-in?returnTo=${encodedIntendedUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/roadmaps", "/chat"], // Specify the routes the middleware applies to
};
