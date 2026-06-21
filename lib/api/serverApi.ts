import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

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

interface CheckSessionResponse {
  success: boolean;
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

  const response = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: await getServerHeaders(),
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: await getServerHeaders(),
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me", {
    headers: await getServerHeaders(),
  });

  return response.data;
}

export async function checkSession(): Promise<
  AxiosResponse<CheckSessionResponse>
> {
  const response = await api.get<CheckSessionResponse>("/auth/session", {
    headers: await getServerHeaders(),
  });

  return response;
}