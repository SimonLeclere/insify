'use server'

import { prisma } from "@/lib/prisma";

export async function getProjectContent(projectId: string) {
  const projectIdNum = Number(projectId);

  // Validation de l'entrée
  if (typeof projectIdNum !== "number" || projectIdNum <= 0) {
    return {
      success: false,
      data: null,
      error: "Invalid projectId provided. It must be a positive number.",
    };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectIdNum },
      select: {
        id: true,
        content: true,
        updatedAt: true
      }
    });

    if (!project) {
      return {
        success: false,
        data: null,
        error: `Project with ID ${projectIdNum} not found.`,
      };
    }

    return {
      success: true,
      data: {
        id: project.id,
        content: project.content ? new Uint8Array(project.content) : null,
        updatedAt: project.updatedAt
      },
      error: null,
    };

  } catch (error) {
    console.error("Unexpected error retrieving project content: ", error);
    return {
      success: false,
      data: null,
      error: "An unexpected error occurred while retrieving the project content.",
    };
  }
}
