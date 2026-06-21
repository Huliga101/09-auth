import axios, { isAxiosError, type AxiosResponse } from "axios";
import { NextResponse } from "next/server";

export const BASE_URL = "https://notehub-api.goit.study";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export function getCookieHeader(request: Request): string {
  return request.headers.get("cookie") ?? "";
}

export function createApiResponse<T>(apiResponse: AxiosResponse<T>) {
  const response = NextResponse.json(apiResponse.data, {
    status: apiResponse.status,
  });

  const setCookie = apiResponse.headers["set-cookie"];

  if (setCookie) {
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    cookieArray.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });
  }

  return response;
}

export function createErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    return NextResponse.json(
      {
        error: error.message,
        response: error.response?.data ?? null,
      },
      { status: error.response?.status ?? 500 },
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 },
  );
}