import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { api } from "../../api";
import { logErrorResponse } from "../../_utils/utils";

function setAuthCookies(
  response: NextResponse,
  setCookieHeader: string | string[] | undefined,
) {
  if (!setCookieHeader) return;

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);

    const options = {
      httpOnly: true,
      path: parsed.Path ?? "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
    };

    if (parsed.accessToken) {
      response.cookies.set("accessToken", parsed.accessToken, options);
    }

    if (parsed.refreshToken) {
      response.cookies.set("refreshToken", parsed.refreshToken, options);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/login", body);

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    setAuthCookies(response, apiRes.headers["set-cookie"]);

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}