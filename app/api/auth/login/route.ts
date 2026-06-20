import axios from "axios";
import {
  BASE_URL,
  createApiResponse,
  createErrorResponse,
  getCookieHeader,
} from "../../api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await axios.post(`${BASE_URL}/auth/login`, body, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}