import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { PrismaClient } from "@prisma/client";
import { Home } from "lucide-react";

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
  isMobile: boolean;
  params: Promise<{ projectID: string; teamID: string }>;
}) {
  const { projectID, teamID } = await params;
  const result = await getTeamAndProject(Number(teamID), Number(projectID));

  return (
    <BreadcrumbList className="flex flex-nowrap items-center min-w-0 overflow-hidden whitespace-nowrap">
      <BreadcrumbItem>
        <BreadcrumbLink href={`/t/${teamID}`} className="hidden lg:inline-flex">
          Accueil
        </BreadcrumbLink>
        <BreadcrumbLink href={`/t/${teamID}`} className="lg:hidden inline-flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
          >
            <Home />
            <span className="sr-only">Accueil</span>
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {result?.teamName && (
        <>
          <BreadcrumbSeparator className="hidden lg:inline-flex"/>
          <BreadcrumbItem className="hidden lg:inline-flex">
            <BreadcrumbLink href={`/t/${teamID}/projects`}>
              {result.teamName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}

      {result?.projectName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="shrink min-w-0 overflow-hidden text-ellipsis">
            <BreadcrumbPage className="capitalize min-w-0 shrink overflow-hidden text-ellipsis">
              {result.projectName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  );
}
