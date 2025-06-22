"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Settings2, File, Home } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const getNavItems = (pathname: string | null) => [
  {
    title: "Accueil",
    url: `/`,
    icon: Home,
    isActive: pathname === `/`,
    items: [
      { title: "Projets", url: `/projects` },
      { title: "Partages", url: `/projects` },
      { title: "Statistiques", url: `/stats` },
    ],
  },
  {
    title: "Modèles",
    url: `/templates`,
    icon: File,
    isActive: pathname?.startsWith(`/templates`),
    items: [
      { title: "Galerie publique", url: `/templates/public` },
      { title: "Mes modèles", url: `/templates/mine` },
    ],
  },
  {
    title: "Documentation",
    url: `/doc`,
    icon: BookOpen,
    isActive: pathname?.startsWith(`/doc`),
    items: [
      { title: "Introduction", url: `/docs/introduction` },
      { title: "Tutoriels", url: `/docs/tutorials` },
      { title: "Nouveautés", url: `/docs/changelog` },
    ],
  },
  {
    title: "Paramètres",
    url: `/settings`,
    icon: Settings2,
    isActive: pathname?.startsWith(`/settings`),
    items: [
      { title: "Compte", url: `/settings#account` },
      { title: "Général", url: `/settings#general` },
      { title: "Apparence", url: `/settings#appearance` },
      { title: "IA", url: `/settings#ai` },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const navMain = getNavItems(pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
