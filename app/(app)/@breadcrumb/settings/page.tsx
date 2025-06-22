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
import { usePathname } from "next/navigation";

export default function BreadcrumbSlot() {
  const pathname = usePathname();

  // pathname="/settings#section"
  const currentSectionName = pathname.split("#")[1] || "";

  return (
    <BreadcrumbList className="flex flex-nowrap items-center min-w-0 overflow-hidden whitespace-nowrap">
      <BreadcrumbItem>
        <BreadcrumbLink
          href="/"
          className="hidden lg:inline-flex"
        >
          Accueil
        </BreadcrumbLink>
        <BreadcrumbLink
          href="/"
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
        <BreadcrumbLink href="/settings">
          Paramètres
        </BreadcrumbLink>
      </BreadcrumbItem>

      {currentSectionName && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="shrink min-w-0 overflow-hidden text-ellipsis">
            <BreadcrumbPage className="capitalize min-w-0 shrink overflow-hidden text-ellipsis">
              #{currentSectionName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </BreadcrumbList>
  );
}
