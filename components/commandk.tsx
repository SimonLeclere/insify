"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  Laptop,
  LayoutGrid,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";

import * as Icons from "lucide-react";
const IconsMap = Icons as unknown as Record<string, Icons.LucideIcon>;

import { useProjectModal } from "@/components/CreateProjectModal/ProjectModalProvider";
import { useProjects } from "@/providers/ProjectsContext";
import { useRouter } from "next/navigation";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter()

  const { openModal: openCreateProjectModal } = useProjectModal();
  const { theme, setTheme } = useTheme();
  const { allUserProjects } = useProjects();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
    setSearch("")
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden inline-flex h-7 w-7 justify-center"
        onClick={() => setOpen(true)}
      >
        <Search />
        <span className="sr-only">Accueil</span>
      </Button>

      <Button
        variant="outline"
        className={cn(
          "hidden lg:inline-flex relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span>Rechercher...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Tapez une commande ou recherchez..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>

          <CommandGroup heading="Projets">
            {search?.trim().startsWith("%") &&
              allUserProjects?.map((p) => {
                const Icon = (p.icon && IconsMap[p.icon]) || IconsMap["Book"];

                return (
                  <CommandItem
                    key={p.id}
                    keywords={["%"]}
                    onSelect={() => runCommand(() => router.push(`/t/${p.teamId}/editor/${p.id}`))}
                  >
                    <Icon />
                    <span>{p.name}</span>
                    <span className="sr-only">%{p.name}</span>
                  </CommandItem>
                );
              })}

            {
              !search?.startsWith("%") &&
              <CommandItem onSelect={() => setSearch("%")}>
                <LayoutGrid />
                <span>Projets</span>
                <CommandShortcut>%</CommandShortcut>
              </CommandItem>
            }
            <CommandItem onSelect={() => runCommand(openCreateProjectModal)}>
              <Plus />
              <span>Créer un nouveau projet</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Équipes">
            {/* {search?.trim().startsWith("$") &&
              allUserProjects?.map((p) => {
                const Icon = (p.icon && IconsMap[p.icon]) || IconsMap["Book"];

                return (
                  <CommandItem
                    key={p.id}
                    keywords={["%"]}
                    onSelect={() => runCommand(() => router.push(`/t/${p.teamId}/editor/${p.id}`))}
                  >
                    <Icon />
                    <span>{p.name}</span>
                    <span className="sr-only">%{p.name}</span>
                  </CommandItem>
                );
              })} */}

            {
              !search?.startsWith("$") &&
              <CommandItem onSelect={() => setSearch("$")}>
                <LayoutGrid />
                <span>Équipes</span>
                <CommandShortcut>$</CommandShortcut>
              </CommandItem>
            }
            <CommandItem>
              <Plus />
              <span>Créer une nouvelle équipe</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem
              onSelect={() => runCommand(() => setTheme("light"))}
              keywords={["theme"]}
            >
              <Sun />
              Light
              {theme === "light" && (
                <CommandShortcut>
                  <Check />
                </CommandShortcut>
              )}
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("dark"))}
              keywords={["theme"]}
            >
              <Moon />
              Dark
              {theme === "dark" && (
                <CommandShortcut>
                  <Check />
                </CommandShortcut>
              )}
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("system"))}
              keywords={["theme"]}
            >
              <Laptop />
              System
              {theme === "system" && (
                <CommandShortcut>
                  <Check />
                </CommandShortcut>
              )}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
