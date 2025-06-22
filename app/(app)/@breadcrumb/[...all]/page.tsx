"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

export default function BreadcrumbSlot() {
  const pathname = usePathname()

  // Fonction pour générer les breadcrumbs dynamiquement
  const generateBreadcrumbs = () => {
    const pathSegments = pathname?.split("/").filter(Boolean) || []

    // Si aucun segment, afficher "Accueil"
    if (pathSegments.length === 0) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage>Accueil</BreadcrumbPage>
        </BreadcrumbItem>
      )
    }

    return pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const isLast = index === pathSegments.length - 1

      return (
        <React.Fragment key={href}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={href}>{decodeURIComponent(segment)}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      )
    })
  }  

  return (
    <Breadcrumb>
      <BreadcrumbList>{generateBreadcrumbs()}</BreadcrumbList>
    </Breadcrumb>
  )
}
