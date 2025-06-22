"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteProject(projectId: string) {
  "use server";
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { success: false, data: null, error: "User not authenticated." };
    }

    if (!projectId) {
      return { success: false, data: null, error: "The selected project does not exist or does not belong to your organizations." };
    }
    
    const userOrganizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId: { in: userOrganizations.map(org => org.id) } },
    });

    if (!project) {
      return { success: false, data: null, error: "The selected project does not exist or does not belong to your organizations." };
    }

    const organization = userOrganizations.find(org => org.id === project.organizationId);

    const hasPermission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        organizationId: organization?.id,
        permissions: {
          project: ["delete"],
        }
      }
    });

    if (!hasPermission.success) {
      return { success: false, data: null, error: "Invalid permissions." };
    }

    const deletedProject = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });

    return { success: true, data: deletedProject, error: null };

  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, data: null, error: "Unknown error." };
  }
}

export async function restoreProject(projectId: string) {
  "use server";
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return { success: false, data: null, error: "User not authenticated." };
    }

    if (!projectId) {
      return { success: false, data: null, error: "The selected project does not exist or does not belong to your organizations." };
    }
    
    const userOrganizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId: { in: userOrganizations.map(org => org.id) } },
    });

    if (!project) {
      return { success: false, data: null, error: "The selected project does not exist or does not belong to your organizations." };
    }

    const organization = userOrganizations.find(org => org.id === project.organizationId);

    const hasPermission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        organizationId: organization?.id,
        permissions: {
          project: ["delete"]
        }
      }
    });

    if (!hasPermission.success) {
      return { success: false, data: null, error: "Invalid permissions." };
    }

    const restoredProject = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: null },
    });

    return { success: true, data: restoredProject, error: null };

  } catch (error) {
    console.error("Error restoring project:", error);
    return { success: false, data: null, error: "Unknown error." };
  }
}
