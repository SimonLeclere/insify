'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Value } from "@udecode/plate";

export async function updateProject(
  projectId: string,
  nodes: Value
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

  if (!Array.isArray(nodes)) {
    return {
      success: false,
      data: null,
      error: "Invalid nodes data provided. It must be an array.",
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

    // Mise à jour du projet
    const project = await prisma.project.update({
      where: {
        id: projectIdNum,
      },
      data: {
        nodes: nodes as unknown as Prisma.InputJsonValue[], //
      },
    });

    return {
      success: true,
      data: project,
      error: null,
    };

  } catch (error) {
    // Erreur générale pour tous les autres cas
    console.error("Unexpected error: ", error);
    return {
      success: false,
      data: null,
      error: "An unexpected error occurred while updating the project.",
    };
  }
}
