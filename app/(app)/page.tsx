"use client";

import { CreateProjectButton } from "@/components/createProjectButton";
import { RandomHint } from "@/components/RandomHint";
import { Separator } from "@/components/ui/separator";
import { useProjects } from "@/providers/ProjectsContext";
import { useUserSettings } from "@/providers/UserSettingsContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months =
    now.getMonth() -
    date.getMonth() +
    12 * (now.getFullYear() - date.getFullYear());

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (weeks === 1) return "La semaine dernière";
  if (weeks < 4) return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  if (months === 1) return "Le mois dernier";
  if (months < 12) return date.toLocaleString("fr-FR", { month: "long" });
  return date.toLocaleString("fr-FR", { month: "long", year: "numeric" });
}

export default function Page() {
  const { visibleProjects } = useProjects();
  const router = useRouter();

  const projectsToShow = visibleProjects.slice(0, 3);
  const { settings, loading } = useUserSettings();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Bienvenue sur INSify</h1>
        <p className="text-muted-foreground">
          Créez un nouveau projet pour commencer
        </p>
        <CreateProjectButton />
      </div>

      {projectsToShow.length > 0 && <>
        <Separator className="w-full max-w-md" />

        {/* Liste des projets récents */}
        <div className="w-full max-w-md">
          <h2 className="text-lg font-medium">Projets récents</h2>
          <ul className="mt-2 space-y-2">
            <AnimatePresence>
              {projectsToShow.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: index * 0.05, // Décalage progressif comme dans nav-projects
                  }}
                >
                  <li
                    className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      router.push(`/editor/${project.id}`)
                    }
                  >
                    <span>{project.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatRelativeDate(project.updatedAt)}
                    </span>
                  </li>
                </motion.div>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </>
      }

      {/* TODO: placer l'astuce par rapport au bas de la div */}
      <div className="w-full max-w-md min-h-[48px] flex items-center justify-center">
        <AnimatePresence>
          {!loading && settings?.homepageHints && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              className="w-full"
            >
              <RandomHint />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
