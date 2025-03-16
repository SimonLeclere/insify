"use client"

import * as React from "react"
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Prisma } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useTeams } from "@/providers/TeamsProvider"

type TeamWithTeamUsers = Prisma.TeamGetPayload<{
  include: {
    TeamUser: true;
  };
}>

type TeamSwitcherProps = {
  onChange?: (team: TeamWithTeamUsers) => void;
};

export function TeamSwitcher({ onChange }: TeamSwitcherProps) {

  const { isMobile } = useSidebar()
  const { teams, currentTeamID, setCurrentTeamID } = useTeams()
  const router = useRouter();
  
  const [activeTeam, setActiveTeam] = React.useState(teams && (teams.find(x => x.id === currentTeamID) || teams[0]))

  const changeTeam = (team: TeamWithTeamUsers) => {
    setActiveTeam(team)
    if (onChange) onChange(team)
    else {
      setCurrentTeamID(team.id)
      router.push(`/t/${team.id}`);
    }
  };

  if (!teams || !activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{"Etudiant"}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => changeTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-xs border">
                  <GalleryVerticalEnd className="size-4 shrink-0" />
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Ajouter une équipe</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
