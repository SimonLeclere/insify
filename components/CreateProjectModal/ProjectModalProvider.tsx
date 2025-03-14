// src/modals/ProjectModalProvider.tsx
"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import CreateProjectModal from "./CreateProjectModal";
import { Prisma } from "@prisma/client";

type ProjectModalContextType = {
  openModal: () => void;
};

type UserTeams = Prisma.UserGetPayload<{
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
}>['teams'];

type TeamSwitcherProps = {
  children: ReactNode;
  teams: UserTeams | undefined;
  currentTeamID: number;
}

const ProjectModalContext = createContext<ProjectModalContextType | undefined>(undefined);

export function ProjectModalProvider({ teams, currentTeamID, children }: TeamSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ProjectModalContext.Provider value={{ openModal }}>
      {children}
      {/* Le modal est rendu ici et son état est géré par le provider */}
      <CreateProjectModal isOpen={isOpen} onClose={closeModal} teams={teams} currentTeamID={currentTeamID} />
    </ProjectModalContext.Provider>
  );
}

export function useProjectModal() {
  const context = useContext(ProjectModalContext);
  if (!context) {
    throw new Error("useProjectModal must be used within a ProjectModalProvider");
  }
  return context;
}
