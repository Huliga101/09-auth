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

function redirectToSignIn(request: NextRequest) {
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

function redirectToProfile(request: NextRequest) {
  return NextResponse.redirect(new URL("/profile", request.url));
}

async function refreshSession(request: NextRequest) {
  try {
    const sessionResponse = await checkSession();

    if (!sessionResponse.data.success) {
      return null;
    }

    const setCookieHeader = sessionResponse.headers["set-cookie"];

    if (!setCookieHeader) {
      return null;
    }

    const response = NextResponse.redirect(request.url);
    applySetCookie(response, setCookieHeader);

    return response;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const privateRoute = isPrivateRoute(pathname);
  const authRoute = isAuthRoute(pathname);

  if (privateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      const refreshedResponse = await refreshSession(request);

      if (refreshedResponse) {
        return refreshedResponse;
      }
    }

    return redirectToSignIn(request);
  }

  if (authRoute) {
    if (accessToken) {
      return redirectToProfile(request);
    }

    if (refreshToken) {
      const refreshedResponse = await refreshSession(request);

      if (refreshedResponse) {
        return redirectToProfile(request);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};