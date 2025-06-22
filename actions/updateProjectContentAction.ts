'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateProjectContent(
  projectId: string,
  content: Uint8Array
) {

  // Validation de l'entrée
  if (!projectId) {
    return {
      success: false,
      data: null,
      error: "Invalid projectId provided",
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
    // 1. Vérifier la session utilisateur
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { success: false, data: null, error: "Utilisateur non connecté." };
    }

    // 2. Vérifier l'appartenance du projet à une organisation de l'utilisateur
    const userOrganizations = await auth.api.listOrganizations({
      headers: await headers(),
    });
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId: { in: userOrganizations.map(org => org.id) } },
    });
    if (!project) {
      return {
        success: false,
        data: null,
        error: `Le projet sélectionné n'existe pas ou n'appartient pas à vos organisations.`,
      };
    }
    const organization = userOrganizations.find(org => org.id === project.organizationId);

    // 3. Vérifier la permission update
    const hasPermission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        organizationId: organization?.id,
        permissions: {
          project: ["update"]
        }
      }
    });
    if (!hasPermission.success) {
      return { success: false, data: null, error: `Invalid permissions` };
    }

    // 4. Mise à jour du projet avec le contenu Yjs
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        content: Buffer.from(content),
        updatedAt: new Date()
      },
    });

    return {
      success: true,
      data: updatedProject,
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
