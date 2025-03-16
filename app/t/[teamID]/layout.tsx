import { getServerAuth } from "@/hooks/serverAuth";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";

import { ProjectModalProvider } from "@/components/CreateProjectModal/ProjectModalProvider";
import { ProjectsProvider } from "@/providers/ProjectsContext";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "@/app/globals.css";
import { prisma } from "@/lib/prisma";
import { CommandMenu } from "@/components/commandk";
import { SyncProvider } from "@/providers/SyncProvider";
import { TeamsProvider } from "@/providers/TeamsProvider";
import { Prisma } from "@prisma/client";

export default async function RootLayout({
  children,
  breadcrumb,
  syncstatus,
  params,
}: {
  children: React.ReactNode;
  syncstatus: React.ReactNode;
  breadcrumb: React.ReactNode;
  params: Promise<{ teamID: string }>;
}) {
  const { teamID } = await params;

  const session = await getServerAuth();
  if (!session || !session.user) {
    return notFound();
  }

  // Fetch des données depuis la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teams: {
        include: {
          TeamUser: true,
        },
      },
    },
  });

  if (!user) return redirect("/auth/login");

  if (
    user &&
    (!teamID || !user.teams.some((t) => t.id.toString() === teamID))
  ) {
    // find the user's default team
    const defaultTeam = user.teams.find((team) => {
      return team.TeamUser.find(
        (u) => u.userId === user.id && u.role === "owner"
      );
    });

    if (defaultTeam) return redirect(`/t/${defaultTeam.id}`);
    redirect("/");
  }

  const currentTeamID = Number(teamID);

  const projects = await prisma.project.findMany({
    where: { teamId: { in: user?.teams.map((t) => t.id) || [] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <SidebarProvider>
      <SyncProvider>
        <TeamsProvider initialTeams={user.teams} currentTeam={currentTeamID}>
          <ProjectsProvider initialProjects={projects}>
            <ProjectModalProvider currentTeamID={currentTeamID}>
              <AppSidebar user={user} currentTeamID={currentTeamID} />
              <SidebarInset className="flex flex-1 flex-col">
                {/* Navbar */}
                <header className="flex h-16 shrink-0 items-center justify-between px-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <SidebarTrigger className="-ml-1" />
                    {breadcrumb}
                  </div>

                  <div className="flex items-center gap-2">
                    {syncstatus}
                    <CommandMenu />
                  </div>
                </header>

                {/* Contenu dynamique */}
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {children}
                </main>
              </SidebarInset>
            </ProjectModalProvider>
          </ProjectsProvider>
        </TeamsProvider>
      </SyncProvider>
    </SidebarProvider>
  );
}
