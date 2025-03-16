"use client";
import { Download, Forward, Info, MoreHorizontal, PlusIcon, Trash2 } from "lucide-react";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProjectModal } from "@/components/CreateProjectModal/ProjectModalProvider";
import { useProjects } from "@/providers/ProjectsContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { deleteProject, restoreProject } from "@/actions/deleteProjectAction";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";

type Project = Prisma.ProjectGetPayload<object>;

export function NavProjects({ teamId }: { teamId: number }) {
  const { isMobile } = useSidebar();
  const { openModal } = useProjectModal();
  const { projectID: activeProjectId } = useParams<{ projectID: string }>();

  const {
    visibleProjects,
    loadMoreProjects,
    hasMore,
    removeProject,
    restoreProject: restoreProjectInNav,
  } = useProjects();

  const noProjects = visibleProjects.length === 0;

  const isMounted = useMounted();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isShiftPressed, setIsShiftPressed] = useState(false); // État pour détecter si Shift est enfoncé

  // Écouter les événements de touche pour détecter si Shift est enfoncé
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleDelete = async (project: Project) => {
    setConfirmOpen(false);

    const promise = new Promise(async (resolve, reject) => {
      const { success, data, error } = await deleteProject(project.id);
      if (success && data) {
        resolve(data);
        removeProject(project.id);

        if (project.id.toString() === activeProjectId) {
          router.push(`/t/${teamId}`); // Rediriger vers l'accueil de l'équipe
        }

      } else {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Suppression du projet...",
      success: () => ({
        message: "Projet supprimé avec succès !",
        action: {
          label: "Annuler",
          onClick: async () => {
            const { success, data } = await restoreProject(project.id);
            if (success && data) {
              toast.success("Projet restauré !");
              restoreProjectInNav(data.id);
            } else {
              toast.error("Impossible de restaurer le projet.");
            }
          },
        },
      }),
      error: "Erreur lors de la suppression du projet",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        Projets
        <button
          className="ml-auto text-sidebar-foreground/70 cursor-pointer hover:bg-sidebar-accent p-1 rounded-md"
          onClick={openModal}
        >
          <PlusIcon size={16} />
          <span className="sr-only">Plus</span>
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <AnimatePresence>
          {visibleProjects.map((item, index) => {
            const IconsMap = Icons as unknown as Record<string, LucideIcon>;
            const Icon = (item.icon && IconsMap[item.icon]) || IconsMap["Book"];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: isMounted ? 0 : index * 0.05,
                }}
              >
                <SidebarMenuItem
                  className={
                    item.id.toString() === activeProjectId
                      ? "bg-sidebar-accent text-sidebar-accent-foreground rounded-md"
                      : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={`/t/${teamId}/editor/${item.id}`}>
                      <Icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem>
                        <Info className="text-muted-foreground" />
                        <span>Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="text-muted-foreground" />
                        <span>Export</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          setSelectedProject(item);
                          if (e.shiftKey) {
                            // Supprimer directement sans confirmation si Shift est enfoncé
                            handleDelete(item);
                          } else {
                            // Afficher le dialog de confirmation sinon
                            setConfirmOpen(true);
                          }
                        }}
                        className={`${
                          isShiftPressed ? "text-destructive" : ""
                        } transition-colors`}
                      >
                        <Trash2
                          className={`${
                            isShiftPressed
                              ? "text-destructive"
                              : "text-muted-foreground"
                          } transition-colors`}
                        />
                        <span
                          className={`${
                            isShiftPressed ? "text-destructive" : ""
                          } transition-colors`}
                        >
                          Delete
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </motion.div>
            );
          })}

          {/* Bouton "Plus" qui apparaît après les projets */}
          {hasMore && (
            <motion.div
              key="load-more"
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: isMounted ? 0 : visibleProjects.length * 0.05,
              }} // Décalage après les projets
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-sidebar-foreground/70"
                  onClick={loadMoreProjects}
                >
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>Plus</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
          )}

          {/* Message "Pas de projet" si aucun projet */}
          {!hasMore && noProjects && (
            <motion.div
              layout
              key="no-projects"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: isMounted ? 0 : visibleProjects.length * 0.05,
              }}
            >
              <SidebarMenuItem className="relative px-2 py-3">
                <div className="flex flex-col">
                  <span className="text-sidebar-foreground/90 text-sm">
                    Pas de projet récent
                  </span>
                  <span className="text-sidebar-foreground/70 text-sm">
                    Créez en un pour commencer
                  </span>
                </div>
              </SidebarMenuItem>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarMenu>

      {/* confirmation de suppression */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet ?</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer &quot;{selectedProject?.name}
            &quot; ? Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProject && handleDelete(selectedProject)}
            >
              {" "}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}
