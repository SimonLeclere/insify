"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { fr } from "./fr";
import { extensions } from "./extensions"

import { useSync } from "@/providers/SyncProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Editor({ content, projectId, readOnly=false }: { content: any, projectId?: string, readOnly?: boolean }) {
  const { syncProject } = useSync();

  const editor = useCreateBlockNote({
    initialContent: content || undefined,
    dictionary: fr,
    trailingBlock: false,
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
      editable={!readOnly}
      onChange={() => {
        console.log(JSON.stringify(editor.document, null, 2))
        return projectId && syncProject(projectId, editor.document)
      }}
    />
  );
}

