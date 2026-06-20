"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/notes";
import type { NoteTag } from "@/types/note";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import Link from "next/link";

const PER_PAGE = 12;

interface NotesClientProps {
  selectedTag: string;
  tag?: NoteTag;
}

export default function NotesClient({ selectedTag, tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 500);

    return () => window.clearTimeout(timerId);
  }, [inputValue]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", selectedTag, search, page],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    throw error;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onChange={setInputValue} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
         Create note +
        </Link>
      </div>

      <NoteList notes={notes} />
    </>
  );
}