"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { fr } from "./fr";

import { useSync } from "@/providers/SyncProvider";
import { Prisma } from "@prisma/client";

type Project = Prisma.ProjectGetPayload<object>;

export default function Editor({ project, projectId }: { project: Project, projectId: string }) {
  const { syncProject } = useSync();

  const initialContent = project.nodes && JSON.parse(project.nodes)

  const editor = useCreateBlockNote({
    initialContent: initialContent || undefined,
    dictionary: fr,
    trailingBlock: false,
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        syncProject(projectId, editor.document);
      }}
    />
  );
}
