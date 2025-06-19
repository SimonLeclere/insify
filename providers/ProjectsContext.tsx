"use client";

import { createContext, useContext, useState } from "react";
import { Prisma } from "@prisma/client";

type Project = Prisma.ProjectGetPayload<object>;

type ProjectsContextType = {
  allUserProjects: Project[];
  visibleProjects: Project[];
  addProject: (newProject: Project) => void;
  removeProject: (projectID: number) => void;
  restoreProject: (projectID: number) => void;
  loadMoreProjects: () => void;
  hasMore: boolean;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children, initialProjects }: { children: React.ReactNode; initialProjects: Project[] }) => {
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [visibleCount, setVisibleCount] = useState(5);

  const addProject = (newProject: Project) => {
    setAllProjects((prevProjects) => [newProject, ...prevProjects]);
    setVisibleCount((prev) => prev + 1);
  };

  const removeProject = (projectID: number) => {
    setAllProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === projectID ? { ...p, deletedAt: new Date() } : p
      )
    );
    setVisibleCount((prev) => (prev - 1 <= 5 ? 5 : prev - 1));
  };
  
  const restoreProject = (projectID: number) => {
    setAllProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === projectID ? { ...p, deletedAt: null } : p
      )
    );
    setVisibleCount((prev) => prev + 1);
  };

  const loadMoreProjects = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const visibleProjects = allProjects.filter(p => !p.deletedAt).slice(0, visibleCount);
  const hasMore = allProjects.filter(p => !p.deletedAt).length > visibleCount;

  const allUserProjects = allProjects.filter(p => !p.deletedAt);

  return (
    <ProjectsContext.Provider value={{ visibleProjects, allUserProjects, addProject, removeProject, restoreProject, loadMoreProjects, hasMore }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
