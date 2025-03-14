import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getTeamAndProject(teamId: number, projectId: number) {
  try {
    const teamAndProject = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        name: true,
        projects: {
          where: { id: projectId },
          select: {
            name: true,
          },
        },
      },
    });

    if (!teamAndProject) return null;

    return {
      teamName: teamAndProject.name,
      projectName: teamAndProject.projects.length
        ? teamAndProject.projects[0]?.name
        : null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return null;
  }
}

export default async function BreadcrumbSlot({
  params,
}: {
  params: { projectID: string; teamID: string };
}) {
  const { projectID, teamID } = await params;
  const result = await getTeamAndProject(Number(teamID), Number(projectID));

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/t/${teamID}`}>Accueil</BreadcrumbLink>
      </BreadcrumbItem>

      {result?.teamName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${teamID}/projects`}>
              {result.teamName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}

      {result?.projectName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {result.projectName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  );
}
