import axios from "axios";
import {
  BASE_URL,
  createApiResponse,
  createErrorResponse,
  getCookieHeader,
} from "../../api";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const apiResponse = await axios.get(`${BASE_URL}/notes/${id}`, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const apiResponse = await axios.delete(`${BASE_URL}/notes/${id}`, {
      headers: {
        Cookie: getCookieHeader(request),
      },
    });

    return createApiResponse(apiResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}