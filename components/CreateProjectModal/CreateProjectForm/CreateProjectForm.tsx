"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { CreateProjectFormValues } from "./types";
import { createProjectAction } from "@/actions/createProjectAction";
import { Form } from "@/components/ui/form";
import MultiStepViewer from "./MultiStepViewer";
import { toast } from "sonner";
import { useProjects } from "@/providers/ProjectsContext";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


type CreateProjectFormProps = { onClose: () => void; };

export default function CreateProjectForm({ onClose }: CreateProjectFormProps) {
  const { addProject } = useProjects();
  const router = useRouter();

  const { data: activeOrganization, isPending } = authClient.useActiveOrganization()

  const projectForm = useForm<CreateProjectFormValues>({
    defaultValues: {
      icon: "Book",
      projectName: "",
      description: "",
      organizationId: activeOrganization?.id,
      template: "blank",
    },
    mode: "onChange",
    resolver: async (data) => {
      const errors: Record<string, Error> = {};

      if (!data.projectName || !data.projectName.trim().length)
        errors["projectName"] = new Error(
          "Veuillez donner un nom à votre projet"
        );

      return {
        values: data,
        errors: errors,
      };
    },
  });

  if (isPending || !activeOrganization) {
    return null;
  }

  const { handleSubmit } = projectForm;

  const onSubmit = async (formData: CreateProjectFormValues) => {
    onClose();

    const promise = new Promise(async (resolve, reject) => {
      const { success, data, error } = await createProjectAction(formData);
      if (success && data) {
        resolve(data);
        addProject(data);

        router.push(`/editor/${data.id}`);
      } else {
        reject(error);
      }
    });

    await toast.promise(promise, {
      loading: "Création du projet...",
      success: "Projet créé avec succès !",
      error: (error) => {
        if (error === "User not authenticated.") {
          return {
            message: "Vous n'êtes pas connecté.",
            action: {
              label: "Se reconnecter",
              onClick: () => {
                router.push("/auth/login");
              }
            },
          };
        }
        return {
          message: `Erreur lors de la création du projet`,
          description: error === "Invalid permissions." ? "Permissions insuffisantes" : null,
        };
      },
    });
  };

  // TODO: quand on fait entrée ca doit passer à l'étape suivante au lieu de valider
  return (
    <Form {...projectForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md max-w-3xl transition-transform"
      >
        <MultiStepViewer form={projectForm} />
      </form>
    </Form>
  );
}
