"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/xl-ai/style.css";

import { extensions } from "./extensions"
import { en } from "@blocknote/core/locales";

import { updateProjectContent } from "@/actions/updateProjectContentAction";

import { User } from "better-auth";
import type { Project } from "@prisma/client";
import { useProjects } from "@/providers/ProjectsContext";
import { useUserSettings } from "@/providers/UserSettingsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AIMenuController } from "@blocknote/xl-ai";
import { MobileToolbar } from "./MobileToolbar";
import FormattingToolbarWithAI from "./FormattingToolbar";
import SuggestionMenuWithAI from "./SuggestionMenu";

import { getAIConfig, getAIExtension } from "./aiConfig";
import { useCollaboration } from "./collabConfig";

export default function Editor({ project, user }: { project?: Project, user?: User }) {

  const { settings, loading } = useUserSettings();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const { resetUpdateDate } = useProjects();

  // Collaboration config externalisée
  const colabConfig = useCollaboration({
    project,
    user,
    updateProjectContent,
    resetUpdateDate
  });

  // IA config externalisée
  const { model, aiEn } = getAIConfig(settings);

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
      getAIExtension(model),
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
      formattingToolbar={!settings?.aiEnabled && !loading && !isMobile}
      slashMenu={!settings?.aiEnabled && !loading}
    >
        {settings?.aiEnabled && !loading && (
          <>
            <AIMenuController />
            {isMobile ? (
              <MobileToolbar formattingToolbar={FormattingToolbarWithAI} />
            ) : (
              <FormattingToolbarWithAI />
            )}
            <SuggestionMenuWithAI editor={editor} />
          </>
        )}
    </BlockNoteView>
  );
}
