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
import { useTheme } from "next-themes"
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Laptop, LayoutGrid, Moon, Plus, Search, Sun } from "lucide-react";
import { useProjectModal } from "@/components/CreateProjectModal/ProjectModalProvider";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { openModal: openCreateProjectModal } = useProjectModal();

  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

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
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList>
          
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          
          <CommandGroup heading="Projets">
            <CommandItem>
                <LayoutGrid />
                <span>Projets</span>
                <CommandShortcut>%</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(openCreateProjectModal)}>
              <Plus />
              <span>Créer un nouveau projet</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))} keywords={['theme']}>
              <Sun />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))} keywords={['theme']}>
              <Moon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))} keywords={['theme']}>
              <Laptop />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
