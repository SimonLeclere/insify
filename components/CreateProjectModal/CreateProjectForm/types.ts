import { IconName } from "@/components/ui/icon-picker";

export interface CreateProjectFormValues {
    icon: IconName
    projectName: string;
    description: string;
    organizationId: string;
    template: string;
  }
  