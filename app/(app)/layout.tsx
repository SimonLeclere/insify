import { AppSidebar } from "@/components/app-sidebar";

import { ProjectModalProvider } from "@/components/CreateProjectModal/ProjectModalProvider";
import { ProjectsProvider } from "@/providers/ProjectsContext";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { prisma } from "@/lib/prisma";
import { CommandMenu } from "@/components/commandk";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default async function AppLayout({ children, breadcrumb }: { children: React.ReactNode; breadcrumb: React.ReactNode }) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session?.session?.activeOrganizationId) {
    return redirect("/auth/login");
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: session.session.activeOrganizationId },
    orderBy: { updatedAt: "desc" },
  });
  
  return (
    <SidebarProvider>
      <ProjectsProvider initialProjects={projects}>
        <ProjectModalProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            {/* Navbar */}
            <header className="flex h-16 shrink-0 items-center justify-between px-4">
              <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="-ml-1" />
                {breadcrumb}
              </div>

              <div className="flex items-center gap-2">
                <CommandMenu />
              </div>
            </header>

            {/* Contenu dynamique */}
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </ProjectModalProvider>
      </ProjectsProvider>
    </SidebarProvider>
  );
}
