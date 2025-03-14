"use server";

import { getServerAuth } from "@/hooks/serverAuth";
import { prisma } from "@/lib/prisma";

export async function deleteProject(projectId: number) {
  if (!projectId) {
    return { success: false, data: null, error: "Aucun projet sélectionné." };
  }

  try {
    const session = await getServerAuth();
    if (!session) {
      return { success: false, data: null, error: "Utilisateur non connecté." };
    }

    const userId = session?.user?.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return {
        success: false,
        data: null,
        error: "Le projet sélectionné n'existe pas.",
      };
    }

    const teamUser = await prisma.teamUser.findFirst({
      where: { teamId: project.teamId, userId: userId },
    });
    if (!teamUser) {
      return { success: false, data: null, error: "Manque de permissions." };
    }

    const deletedProject = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() }, // Marquer comme supprimé
    });

    return { success: true, data: deletedProject, error: null };
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    return { success: false, data: null, error: "Erreur inconnue." };
  }
}

export async function restoreProject(projectId: number) {
  try {
    const restoredProject = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: null }, // Restaurer le projet
    });

    return { success: true, data: restoredProject, error: null };
  } catch (error) {
    console.error("Erreur lors de la restauration du projet :", error);
    return { success: false, data: null, error: "Impossible de restaurer." };
  }
}
