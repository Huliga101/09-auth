import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNotes } from "@/lib/api/notes";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

const SITE_URL = "https://08-zustand.vercel.app";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

const INITIAL_PAGE = 1;
const PER_PAGE = 12;

const validTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = slug[0];
  const filterName = selectedTag === "all" ? "All notes" : selectedTag;

  return {
    title: `NoteHub - ${filterName}`,
    description: `Browse notes filtered by ${filterName}.`,
    openGraph: {
      title: `NoteHub - ${filterName}`,
      description: `Browse notes filtered by ${filterName}.`,
      url: `${SITE_URL}/notes/filter/${selectedTag}`,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "NoteHub application preview",
        },
      ],
    },
  };
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0];

  if (!selectedTag) {
    notFound();
  }

  const tag =
    selectedTag === "all"
      ? undefined
      : validTags.includes(selectedTag as NoteTag)
        ? (selectedTag as NoteTag)
        : null;

  if (tag === null) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", selectedTag, "", INITIAL_PAGE],
    queryFn: () =>
      fetchNotes({
        page: INITIAL_PAGE,
        perPage: PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient selectedTag={selectedTag} tag={tag} />
    </HydrationBoundary>
  );
}