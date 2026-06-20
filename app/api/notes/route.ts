import axios from "axios";
import {
  BASE_URL,
  createApiResponse,
  createErrorResponse,
  getCookieHeader,
} from "../api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const apiResponse = await axios.get(`${BASE_URL}/notes`, {
      params: Object.fromEntries(searchParams.entries()),
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await axios.post(`${BASE_URL}/notes`, body, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}