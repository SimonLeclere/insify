// src/components/CreateProjectForm/CreateProjectForm.tsx
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


type CreateProjectFormProps = {
  currentTeamID: number;
  onClose: () => void;
};

export default function CreateProjectForm({
  currentTeamID,
  onClose,
}: CreateProjectFormProps) {
  const { addProject } = useProjects();
  const router = useRouter();

  const projectForm = useForm<CreateProjectFormValues>({
    defaultValues: {
      icon: "Book",
      projectName: "",
      description: "",
      team: currentTeamID.toString(),
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

  const { handleSubmit } = projectForm;

  const onSubmit = async (formData: CreateProjectFormValues) => {
    onClose();

    const promise = new Promise(async (resolve, reject) => {
      const { success, data, error } = await createProjectAction(formData);
      if (success && data) {
        resolve(data);
        addProject(data);

        router.push(`/t/${data.teamId}/editor/${data.id}`);
      } else {
        reject(error);
      }
    });

    await toast.promise(promise, {
      loading: "Création du projet...",
      success: "Projet créé avec succès !",
      error: (error) => ({
        message: `Erreur lors de la création du projet`,
        description: error,
      }),
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
