// src/modals/ProjectModalProvider.tsx
"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import CreateProjectModal from "./CreateProjectModal";

type ProjectModalContextType = {
  openModal: () => void;
};

type TeamSwitcherProps = {
  children: ReactNode;
}

const ProjectModalContext = createContext<ProjectModalContextType | undefined>(undefined);

export function ProjectModalProvider({ children }: TeamSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ProjectModalContext.Provider value={{ openModal }}>
      {children}
      <CreateProjectModal isOpen={isOpen} onClose={closeModal} />
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
