'use server'

import { prisma } from "@/lib/prisma";

export async function updateProjectContent(
  projectId: string,
  content: Uint8Array
) {
  const projectIdNum = Number(projectId);

  // Validation de l'entrée
  if (typeof projectIdNum !== "number" || projectIdNum <= 0) {
    return {
      success: false,
      data: null,
      error: "Invalid projectId provided. It must be a positive number.",
    };
  }

  if (!(content instanceof Uint8Array)) {
    return {
      success: false,
      data: null,
      error: "Invalid content data provided. It must be a Uint8Array.",
    };
  }

  try {
    // Vérifie si le projet existe avant de tenter de le mettre à jour
    const existingProject = await prisma.project.findUnique({
      where: { id: projectIdNum },
    });

    if (!existingProject) {
      return {
        success: false,
        data: null,
        error: `Project with ID ${projectIdNum} not found.`,
      };
    }

    // Mise à jour du projet avec le contenu Yjs
    const project = await prisma.project.update({
      where: {
        id: projectIdNum,
      },
      data: {
        content: Buffer.from(content),
        updatedAt: new Date()
      } as any, // Forcer le type temporairement
    });

    return {
      success: true,
      data: project,
      error: null,
    };

  } catch (error) {
    // Erreur générale pour tous les autres cas
    console.error("Unexpected error updating project content: ", error);
    return {
      success: false,
      data: null,
      error: "An unexpected error occurred while updating the project content.",
    };
  }
}
