"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { fr } from "./fr";
import { extensions } from "./extensions"

import { useSync } from "@/providers/SyncProvider";

import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<object>
const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D"
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Editor({ content, projectId, readOnly=false, user }: { content: any, projectId?: string, readOnly?: boolean, user?: User }) {
  const { syncProject } = useSync();

  let colabConfig;
  
  if (projectId && user) {
    const WS_URL = process.env.NEXT_PUBLIC_PARTYKIT_URL || "ws://0.0.0.0:1999/rooms/insify";
    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(
      WS_URL,
      projectId,
      doc,
    );

    colabConfig = {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: user.firstName || `user_${user.id}`,
        color: getRandomColor(),
      },
      showCursorLabels: "activity" as "activity" | "always"
    }
  }

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

    collaboration: projectId ? colabConfig : undefined
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

