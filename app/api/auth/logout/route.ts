import axios from "axios";
import {
  BASE_URL,
  createEmptyApiResponse,
  createErrorResponse,
  getCookieHeader,
} from "../../api";

export async function POST(request: Request) {
  try {
    const apiResponse = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Cookie: getCookieHeader(request),
        },
      },
    );

    return createEmptyApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}