import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Create note",
  description: "Create a new personal note in NoteHub.",
  openGraph: {
    title: "Create note",
    description: "Create a new personal note in NoteHub.",
    url: `${SITE_URL}/notes/action/create`,
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

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}