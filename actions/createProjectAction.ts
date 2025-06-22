"use server";

import { CreateProjectFormValues } from "@/components/CreateProjectModal/CreateProjectForm/types";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function createProjectAction(data: CreateProjectFormValues) {
  "use server";
  
  try {
    // Récupération de la session utilisateur
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session) {
      return { success: false, data: null, error: "User not authenticated." };
    }

    // Vérification du nom du projet
    if (!data.projectName || data.projectName.trim().length === 0) {
      return {
        success: false,
        data: null,
        error: "Project name is required.",
      };
    }

    // Vérification de l'ID de l'organisation
    if (!data.organizationId) {
      return { success: false, data: null, error: "Invalid organization." };
    }

    // Vérification de l'existence de l'organisation
    const userOrganizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    const organization = userOrganizations.find(org => org.id === data.organizationId);

    if (!organization) {
      return {
        success: false,
        data: null,
        error: "Organization not found.",
      };
    }

    // Vérification de la permission 'create' sur le projet dans l'organisation
    const hasPermission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        organizationId: organization.id,
        permissions: {
          project: ["create"]
        }
      }
    });
    if (!hasPermission.success) {
      return {
        success: false,
        data: null,
        error: "Invalid permissions.",
      };
    }

    // Création du projet dans la base de données
    const project = await prisma.project.create({
      data: {
        name: data.projectName,
        description: data.description,
        icon: data.icon || "Book",
        organizationId: data.organizationId,
        createdById: session.user.id,
        updatedById: session.user.id,
      },
    });
    return { success: true, data: project, error: null };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      data: null,
      error: "An error occurred while creating the project.",
    };
  }
}
