import axios, { AxiosError, AxiosResponse } from "axios";
import { NextResponse } from "next/server";

export const BASE_URL = "https://notehub-api.goit.study";

export function getCookieHeader(request: Request) {
  return request.headers.get("cookie") ?? "";
}

export function createApiResponse<T>(apiResponse: AxiosResponse<T>) {
  const response = NextResponse.json(apiResponse.data, {
    status: apiResponse.status,
  });

  const setCookie = apiResponse.headers["set-cookie"];

  if (Array.isArray(setCookie)) {
    setCookie.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });
  }

  return response;
}

export function createEmptyApiResponse<T>(apiResponse: AxiosResponse<T>) {
  const response = new NextResponse(null, {
    status: apiResponse.status,
  });

  const setCookie = apiResponse.headers["set-cookie"];

  if (Array.isArray(setCookie)) {
    setCookie.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });
  }

  return response;
}

export function createErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return NextResponse.json(
      {
        message:
          axiosError.response?.data?.message ??
          axiosError.message ??
          "Request failed",
      },
      {
        status: axiosError.response?.status ?? 500,
      },
    );
  }

  return NextResponse.json(
    {
      message: "Unknown server error",
    },
    {
      status: 500,
    },
  );
}