"use client";

import { FormattingToolbar, FormattingToolbarController, getDefaultReactSlashMenuItems, getFormattingToolbarItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { extensions } from "./extensions"
import { en } from "@blocknote/core/locales";

import { updateProjectContent } from "@/actions/updateProjectContentAction";

import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import { useRef } from "react";
import debounce from "lodash.debounce";
import { User } from "better-auth";
import type { Project } from "@prisma/client";
// import { MobileToolbar } from "./MobileToolbar";
import { useProjects } from "@/providers/ProjectsContext";

import { createGroq } from "@ai-sdk/groq";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import { AIMenuController, AIToolbarButton, createAIExtension, getAISlashMenuItems } from "@blocknote/xl-ai";
import "@blocknote/xl-ai/style.css"; // add the AI stylesheet
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { useUserSettings } from "@/providers/UserSettingsContext";

const colors = [ "#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D" ];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function Editor({ project, user }: { project?: Project, user?: User }) {

  const { settings, loading } = useUserSettings();
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<YPartyKitProvider | null>(null);
  const { resolvedTheme } = useTheme();
  const { resetUpdateDate } = useProjects();

  // Fonction debounced pour sauvegarder le contenu Yjs
  const debouncedSave = debounce(async (projectId: string, update: Uint8Array) => {
    try {
      const result = await updateProjectContent(projectId, update);
      resetUpdateDate(projectId);
      if (!result.success) {
        console.error("Erreur lors de la sauvegarde:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  }, 1000);

  let colabConfig;

  if (project && user) {
    const WS_URL = process.env.NEXT_PUBLIC_PARTYKIT_URL || "ws://0.0.0.0:1999/rooms/insify";
    const doc = new Y.Doc();
    // Appliquer l'état initial du projet au document Yjs
    if (project.content) {
      Y.applyUpdate(doc, project.content);
    }
    const provider = new YPartyKitProvider(
      WS_URL,
      project.id.toString(),
      doc,
    );

    // Stocker les références pour le useEffect
    docRef.current = doc;
    providerRef.current = provider;

    // Écouter les mises à jour du document Yjs pour sauvegarder en base
    doc.on('update', (update: Uint8Array, origin: unknown) => {
      // Ne sauvegarder que si l'origine n'est pas la synchronisation initiale
      if (project.id && origin !== provider) {
        // Utiliser l'état complet du document plutôt que juste l'update
        const state = Y.encodeStateAsUpdate(doc);
        debouncedSave(project.id.toString(), state);
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
 
  const provider = createGroq({
    baseURL: "/api/ai",
    apiKey: "",
  });
  
  const model = provider(settings?.aiModel || "llama-3.3-70b-versatile");

  const editor = useCreateBlockNote({
    dictionary: {
      ...en,
      ai: aiEn,
    },
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
    extensions: [
      createAIExtension({
        model,
        stream: false
      }),
    ],
    _tiptapOptions: {
      extensions: extensions,
    },
    collaboration: project?.id ? colabConfig : undefined
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      formattingToolbar={!settings?.aiEnabled && !loading}
      slashMenu={!settings?.aiEnabled && !loading}
    >
        {
          settings?.aiEnabled && !loading && (
            <>
              <AIMenuController />
              <FormattingToolbarWithAI />
              <SuggestionMenuWithAI editor={editor} />
            </>
          )
        }
    </BlockNoteView>
  );
}

// Formatting toolbar with the `AIToolbarButton` added
function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

// Slash menu with the AI option added
function SuggestionMenuWithAI(props: {
  editor: BlockNoteEditor;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            ...getAISlashMenuItems(props.editor),
          ],
          query,
        )
      }
    />
  );
}
