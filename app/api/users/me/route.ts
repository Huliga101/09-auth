import axios from "axios";
import {
  BASE_URL,
  createApiResponse,
  createErrorResponse,
  getCookieHeader,
} from "../../api";

export async function GET(request: Request) {
  try {
    const apiResponse = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await axios.patch(`${BASE_URL}/users/me`, body, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}