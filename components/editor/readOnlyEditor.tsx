"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { extensions } from "./extensions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Editor({ content }: { content: any }) {

  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: content,
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
    _tiptapOptions: {
      extensions: extensions,
    },
  });

  return (
    <BlockNoteView
      editor={editor}
			editable={false}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
