"use server";

import { CreateProjectFormValues } from "@/components/CreateProjectModal/CreateProjectForm/types";
import { getServerAuth } from "@/hooks/serverAuth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createProjectAction(data: CreateProjectFormValues) {
  try {
    // Vérification du nom du projet
    if (!data.projectName || data.projectName.trim().length === 0) {
      return {
        success: false,
        data: null,
        error: "Le nom du projet est requis.",
      };
    }

    // Vérification de l'ID de l'équipe
    const teamId = parseInt(data.team, 10);
    if (isNaN(teamId)) {
      return { success: false, data: null, error: "Equipe invalide." };
    }

    // Vérification de l'existence de l'équipe
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) {
      return {
        success: false,
        data: null,
        error: "L'équipe spécifiée n'existe pas.",
      };
    }

    // Récupérer l'ID de l'utilisateur connecté
    const session = await getServerAuth();
    if (!session) {
      return { success: false, data: null, error: "Utilisateur non connecté." };
    }

    const userId = session?.user?.id;

    // Vérifier que l'utilisateur est membre de l'équipe
    const teamUser = await prisma.teamUser.findFirst({
      where: {
        teamId: teamId,
        userId: userId,
      },
    });
    if (!teamUser) {
      return {
        success: false,
        data: null,
        error: "Vous n'êtes pas membre de cette équipe.",
      };
    }

    // Définir la valeur de "nodes" en fonction du template
    const nodes = [
      {
        type: "h1",
        children: [
          {
            text: "",
          },
        ],
      },
    ] as unknown as Prisma.InputJsonValue[];

    // Création du projet dans la base de données
    const project = await prisma.project.create({
      data: {
        name: data.projectName,
        description: data.description,
        icon: data.icon || "Book",
        team: { connect: { id: teamId } },
        creator: { connect: { id: teamUser.id } },
        nodes: nodes,
      },
    });
    return { success: true, data: project, error: null };
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
    return {
      success: false,
      data: null,
      error: "Une erreur est survenue lors de la création du projet.",
    };
  }
}
