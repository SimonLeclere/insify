import { getServerAuth } from "@/hooks/serverAuth"
import { notFound, redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"

import { ProjectModalProvider } from '@/components/CreateProjectModal/ProjectModalProvider';
import { ProjectsProvider } from "@/providers/ProjectsContext";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import "@/app/globals.css"
import { prisma } from "@/lib/prisma"

export default async function RootLayout({ children, breadcrumb, params }: { children: React.ReactNode, breadcrumb: React.ReactNode, params: { teamID: string } }) {

  const { teamID } = await params

  const session = await getServerAuth() 
  if (!session || !session.user) {
    return notFound()
  }

  // Fetch des données depuis la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teams: {
        select: {
          id: true, // ID de l'équipe
          name: true, // Nom de l'équipe
          TeamUser: {
            select: {
              userId: true, // Id de l'utilisateur
              role: true, // Rôle de l'utilisateur dans l'équipe
            },
          },
        },
      },
    },
  });

  if (user && (!teamID || !user.teams.some((t) => t.id.toString() === teamID))) {
    // find the user's default team
    const defaultTeam = user.teams.find(team => {
      return team.TeamUser.find(u => u.userId === user.id && u.role === "owner");
    });

    if (defaultTeam) return redirect(`/t/${defaultTeam.id}`);
    redirect('/')
  }

  const currentTeamID = Number(teamID);

  const projects = await prisma.project.findMany({
    where: { teamId: { in: user?.teams.map((t) => t.id) || [] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <SidebarProvider>
      <ProjectsProvider initialProjects={projects}>
        <ProjectModalProvider teams={user?.teams} currentTeamID={currentTeamID} >
          <AppSidebar user={user} currentTeamID={currentTeamID} />
          <SidebarInset className="flex flex-1 flex-col">
            
            {/* Navbar */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              {breadcrumb}
            </header>

            {/* Contenu dynamique */}
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
          </SidebarInset>
        </ProjectModalProvider>
      </ProjectsProvider>
    </SidebarProvider>
  )
}
