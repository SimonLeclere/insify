import { useCallback } from "react";
import { toast } from "sonner";
import { exportProject } from "@/actions/exportProjectAction";
import { BlockNoteSchema } from "@blocknote/core";
import { Prisma } from "@prisma/client";

const sanitizeFilename = (title: string) => {
  return title
    .replace(/[<>:"\/\\|?*\x00-\x1F]/g, "") // Supprime les caractères interdits
    .replace(/\s+/g, "_") // Remplace les espaces par des underscores
    .substring(0, 100) // Limite la longueur du nom
    .trim();
};

type Project = Prisma.ProjectGetPayload<object>;

const useExportPDF = () => {
  return useCallback(async (project: Project) => {

    const exportPromise = exportProject(project.id, BlockNoteSchema.create())
      .then(({ success, data: blob, error }) => {
        if (!success || !blob) throw error;

        const safeTitle = sanitizeFilename(project.name) || "document";

        // Déclenche le téléchargement
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        a.href = url;
        a.download = `${safeTitle}.pdf`;
        a.click();
        URL.revokeObjectURL(url);

        return "Exportation réussie 🎉";
      });

    toast.promise(exportPromise, {
      loading: "Exportation en cours...",
      success: (message) => message,
      error: "Échec de l'exportation ❌",
    });
  }, []);
};

export default useExportPDF;
