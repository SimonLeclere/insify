"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { Home } from "lucide-react";
import { usePathname, useParams } from "next/navigation";

const pages = {
    introduction: "Introduction",
    tutorials: "Tutoriels",
    changelog: "Nouveautés",
    default: ""
}

export default function BreadcrumbSlot() {
  const pathname = usePathname();
  const params = useParams<{ teamID: string }>();

  // pathname="/t/1/docs/introduction"
  const match = pathname.match(/\/docs\/(.+)/);
  const currentPage = match ? (match[1] as keyof typeof pages) : "default";

  const currentPageName = pages[currentPage]

  return (
    <BreadcrumbList className="flex flex-nowrap items-center min-w-0 overflow-hidden whitespace-nowrap">
      <BreadcrumbItem>
        <BreadcrumbLink
          href={`/t/${params.teamID}`}
          className="hidden lg:inline-flex"
        >
          Accueil
        </BreadcrumbLink>
        <BreadcrumbLink
          href={`/t/${params.teamID}`}
          className="lg:hidden inline-flex"
        >
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Home />
            <span className="sr-only">Accueil</span>
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator className="hidden lg:inline-flex" />
      <BreadcrumbItem className="hidden lg:inline-flex">
        <BreadcrumbLink href={`/t/${params.teamID}/docs`}>
          Documentation
        </BreadcrumbLink>
      </BreadcrumbItem>

      {currentPageName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="shrink min-w-0 overflow-hidden text-ellipsis">
            <BreadcrumbPage className="capitalize min-w-0 shrink overflow-hidden text-ellipsis">
              {currentPageName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  );
}
