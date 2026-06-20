import { api } from "./api";
import type { Note, CreateNoteData, NoteTag } from "@/types/note";
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

interface AuthCredentials {
  email: string;
  password: string;
}

interface UpdateUserData {
  username: string;
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

  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await api.post<User>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User | null>("/auth/session");
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(data: UpdateUserData): Promise<User> {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
}