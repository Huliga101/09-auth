"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/notes";
import { useNoteStore } from "@/lib/store/noteStore";
import type { CreateNoteData, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.back();
    },
  });

  const createNoteAction = (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    const newNote: CreateNoteData = {
      title,
      tag,
    };

    if (content) {
      newNote.content = content;
    }

    createMutation.mutate(newNote);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form}>
      <label className={css.label}>
        Title
        <input
          className={css.input}
          name="title"
          type="text"
          value={draft.title}
          onChange={(event) => setDraft({ title: event.target.value })}
          required
          minLength={3}
          maxLength={50}
        />
      </label>

      <label className={css.label}>
        Content
        <textarea
          className={css.textarea}
          name="content"
          value={draft.content}
          onChange={(event) => setDraft({ content: event.target.value })}
          maxLength={500}
        />
      </label>

      <label className={css.label}>
        Tag
        <select
          className={css.input}
          name="tag"
          value={draft.tag}
          onChange={(event) =>
            setDraft({ tag: event.target.value as NoteTag })
          }
        >
          {tags.map((tagName) => (
            <option key={tagName} value={tagName}>
              {tagName}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>

        <button
          type="submit"
          formAction={createNoteAction}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}