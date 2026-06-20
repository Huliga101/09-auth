import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/notes";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

const SITE_URL = "https://08-zustand.vercel.app";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type NoteDetailsPageProps = {   
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: note.content || `Details for note ${note.title}.`,
    openGraph: {
      title: note.title,
      description: note.content || `Details for note ${note.title}.`,
      url: `${SITE_URL}/notes/${id}`,
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

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}