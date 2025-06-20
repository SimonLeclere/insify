"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Prisma } from "@prisma/client";
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

const baseURL = "/t"; // Base des URLs en fonction des équipes

const getNavItems = (teamID: number | null, pathname: string | null) => [
  {
    title: "Accueil",
    url: `${baseURL}/${teamID}`,
    icon: Home,
    isActive: pathname === `${baseURL}/${teamID}`,
    items: [
      { title: "Projets", url: `${baseURL}/${teamID}/projects` },
      { title: "Partages", url: `${baseURL}/${teamID}/projects` },
      { title: "Statistiques", url: `${baseURL}/${teamID}/stats` },
    ],
  },
  {
    title: "Modèles",
    url: `${baseURL}/${teamID}/templates`,
    icon: File,
    isActive: pathname?.startsWith(`${baseURL}/${teamID}/templates`),
    items: [
      { title: "Galerie publique", url: `${baseURL}/${teamID}/templates/public` },
      { title: "Mes modèles", url: `${baseURL}/${teamID}/templates/mine` },
    ],
  },
  {
    title: "Documentation",
    url: `${baseURL}/${teamID}/doc`,
    icon: BookOpen,
    isActive: pathname?.startsWith(`${baseURL}/${teamID}/doc`),
    items: [
      { title: "Introduction", url: `${baseURL}/${teamID}/docs/introduction` },
      { title: "Tutoriels", url: `${baseURL}/${teamID}/docs/tutorials` },
      { title: "Nouveautés", url: `${baseURL}/${teamID}/docs/changelog` },
    ],
  },
  {
    title: "Paramètres",
    url: `${baseURL}/${teamID}/settings`,
    icon: Settings2,
    isActive: pathname?.startsWith(`${baseURL}/${teamID}/settings`),
    items: [
      { title: "Général", url: `${baseURL}/${teamID}/settings#general` },
      { title: "Fonctionnalités", url: `${baseURL}/${teamID}/settings#features` },
      { title: "Apparence", url: `${baseURL}/${teamID}/settings#appearance` },
    ],
  },
];

type UserWithTeams = Prisma.UserGetPayload<{
  include: {
    teams: {
      select: {
        id: true;
        name: true;
        TeamUser: {
          select: {
            userId: true;
            role: true;
          };
        };
      };
    };
  };
}>;

type AppSidebarProps = {
  user: UserWithTeams | null;
  currentTeamID: number;
};

export function AppSidebar({
  user,
  currentTeamID,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const navMain = getNavItems(currentTeamID, pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects teamId={currentTeamID} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
