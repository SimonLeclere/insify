import { useCallback } from "react";
import { toast } from "sonner";
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

    const exportPromise = new Promise<string>(async (resolve, reject) => {
      reject("Exportation non implémentée pour le moment.");
    });

    toast.promise(exportPromise, {
      loading: "Exportation en cours...",
      success: (message) => message,
      error: (error) => error,
    });
  }, []);
};

export default useExportPDF;
