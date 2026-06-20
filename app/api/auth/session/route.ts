import axios from "axios";
import {
  BASE_URL,
  createErrorResponse,
  getCookieHeader,
} from "../../api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const apiResponse = await axios.get(`${BASE_URL}/auth/session`, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return NextResponse.json(apiResponse.data || null, {
      status: 200,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}