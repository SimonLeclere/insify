import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { prisma } from "@/lib/prisma";
import { Home } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BreadcrumbSlot({
  params,
}: {
  isMobile: boolean;
  params: Promise<{ projectID: string; }>;
}) {
  const { projectID } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectID },
    select: {
      name: true,
      organization: true,
    },
  });

  if (!project) return notFound();

  return (
    <BreadcrumbList className="flex flex-nowrap items-center min-w-0 overflow-hidden whitespace-nowrap">
      <BreadcrumbItem>
        <BreadcrumbLink href={`/`} className="hidden lg:inline-flex">
          Accueil
        </BreadcrumbLink>
        <BreadcrumbLink href={`/`} className="lg:hidden inline-flex">
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

      {project?.organization?.name && (
        <>
          <BreadcrumbSeparator className="hidden lg:inline-flex"/>
          <BreadcrumbItem className="hidden lg:inline-flex">
            <BreadcrumbLink href={`/projects`}>
              {project?.organization.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}

      {project?.name && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="shrink min-w-0 overflow-hidden text-ellipsis">
            <BreadcrumbPage className="capitalize min-w-0 shrink overflow-hidden text-ellipsis">
              {project.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  );
}
