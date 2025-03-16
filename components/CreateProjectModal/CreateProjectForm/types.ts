import { IconName } from "@/components/ui/icon-picker";

// src/components/CreateProjectForm/types.ts
export interface CreateProjectFormValues {
    icon: IconName
    projectName: string;
    description: string;
    team: string;
    template: string;
  }
  