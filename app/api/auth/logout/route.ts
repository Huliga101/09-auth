import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "../../api";
import { logErrorResponse } from "../../_utils/utils";

export async function POST() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    await api.post("auth/logout", null, {
      headers: {
        Cookie: `accessToken=${accessToken ?? ""}; refreshToken=${refreshToken ?? ""}`,
      },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    } else {
      logErrorResponse({ message: (error as Error).message });
    }
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return new NextResponse(null, { status: 200 });
}