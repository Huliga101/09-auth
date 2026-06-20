import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

function isPrivateRoute(pathname: string) {
  return privateRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route));
}

function hasAuthCookies(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  return Boolean(accessToken || refreshToken);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = isPrivateRoute(pathname);
  const isAuth = isAuthRoute(pathname);
  const isAuthenticated = hasAuthCookies(request);

  if (isPrivate && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuth && isAuthenticated) {
    const profileUrl = new URL("/profile", request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};