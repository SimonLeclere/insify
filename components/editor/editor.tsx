"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { fr } from "./fr";
import { extensions } from "./extensions"

import { updateProjectContent } from "@/actions/updateProjectContentAction";
import { getProjectContent } from "@/actions/getProjectContentAction";

import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import { Prisma } from "@prisma/client";
import { useRef, useEffect } from "react";
import debounce from "lodash.debounce";

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
  // Références pour les objets Yjs
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<YPartyKitProvider | null>(null);
  const { resolvedTheme } = useTheme();

  // Fonction debounced pour sauvegarder le contenu Yjs
  const debouncedSave = debounce(async (projectId: string, update: Uint8Array) => {
    try {
      const result = await updateProjectContent(projectId, update);
      if (!result.success) {
        console.error("Erreur lors de la sauvegarde:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  }, 1000);

  // Charger le contenu initial depuis la base de données
  useEffect(() => {
    if (!projectId || !docRef.current) return;

    const loadInitialContent = async () => {
      try {
        const result = await getProjectContent(projectId);
        if (result.success && result.data?.content && docRef.current) {
          // Appliquer l'état sauvegardé au document
          Y.applyUpdate(docRef.current, result.data.content);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du contenu initial:", error);
      }
    };

    loadInitialContent();
  }, [projectId]);

  let colabConfig;
  
  if (projectId && user) {
    const WS_URL = process.env.NEXT_PUBLIC_PARTYKIT_URL || "ws://0.0.0.0:1999/rooms/insify";
    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(
      WS_URL,
      projectId,
      doc,
    );

    // Stocker les références pour le useEffect
    docRef.current = doc;
    providerRef.current = provider;

    // Écouter les mises à jour du document Yjs pour sauvegarder en base
    doc.on('update', (update: Uint8Array, origin: unknown) => {
      // Ne sauvegarder que si l'origine n'est pas la synchronisation initiale
      if (projectId && origin !== provider) {
        // Utiliser l'état complet du document plutôt que juste l'update
        const state = Y.encodeStateAsUpdate(doc);
        debouncedSave(projectId, state);
      }
    });

    colabConfig = {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: user.name || `user_${user.id}`,
        color: getRandomColor(),
      },
      showCursorLabels: "activity" as "activity" | "always"
    }
  }

  const editor = useCreateBlockNote({
    initialContent: content || undefined,
    dictionary: fr,
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
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
