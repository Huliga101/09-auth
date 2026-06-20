import axios from "axios";
import { cookies } from "next/headers";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

async function getServerHeaders() {
  const cookieStore = await cookies();

  return {
    Cookie: cookieStore.toString(),
  };
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const response = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
    params,
    headers: await getServerHeaders(),
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: await getServerHeaders(),
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await axios.get<User>(`${baseURL}/users/me`, {
    headers: await getServerHeaders(),
  });

  return response.data;
}

export async function checkSession(): Promise<User | null> {
  const response = await axios.get<User | null>(`${baseURL}/auth/session`, {
    headers: await getServerHeaders(),
  });

  return response.data;
}