import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

function isPrivateRoute(pathname: string) {
  return privateRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route));
}

function applySetCookie(
  response: NextResponse,
  setCookieHeader: string | string[] | undefined,
) {
  if (!setCookieHeader) return;

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  cookies.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const privateRoute = isPrivateRoute(pathname);
  const authRoute = isAuthRoute(pathname);

  let isAuthenticated = Boolean(accessToken);
  let setCookieHeader: string | string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      isAuthenticated = sessionResponse.data.success;
      setCookieHeader = sessionResponse.headers["set-cookie"];
    } catch {
      isAuthenticated = false;
    }
  }

  if (privateRoute && !isAuthenticated) {
    const redirectResponse = NextResponse.redirect(
      new URL("/sign-in", request.url),
    );

    applySetCookie(redirectResponse, setCookieHeader);

    return redirectResponse;
  }

  if (authRoute && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(
      new URL("/profile", request.url),
    );

    applySetCookie(redirectResponse, setCookieHeader);

    return redirectResponse;
  }

  const response = NextResponse.next();

  applySetCookie(response, setCookieHeader);

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};