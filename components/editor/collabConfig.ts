import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import debounce from "lodash.debounce";
import { Project } from "@prisma/client";
import { User } from "better-auth";

const colors = [
  "#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export function useCollaboration({ project, user, updateProjectContent, resetUpdateDate }: {
  project?: Project,
  user?: User,
  updateProjectContent: (projectId: string, update: Uint8Array) => Promise<{
    success: boolean;
    data: Project | null;
    error?: string | null;
  }>,
  resetUpdateDate: (projectId: string) => void
}) {
  let colabConfig;
  const docRef = { current: null as Y.Doc | null };
  const providerRef = { current: null as YPartyKitProvider | null };

  if (project && user) {
    const WS_URL = process.env.NEXT_PUBLIC_PARTYKIT_URL || "ws://0.0.0.0:1999/rooms/insify";
    const doc = new Y.Doc();
    if (project.content) {
      Y.applyUpdate(doc, project.content);
    }
    const provider = new YPartyKitProvider(
      WS_URL,
      project.id.toString(),
      doc,
    );
    docRef.current = doc;
    providerRef.current = provider;
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
    doc.on('update', (update: Uint8Array, origin: unknown) => {
      if (project.id && origin !== provider) {
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
    };
  }
  return colabConfig;
}
