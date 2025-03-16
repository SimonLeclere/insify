"use client";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateProjectFormValues } from "./types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { File, Layout, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import useProjectMultiStepForm from "./useProjectMultiStepForm";
import { Button } from "@/components/ui/button";
import { TeamSwitcher } from "@/components/team-switcher";
import { Prisma } from "@prisma/client";
import { IconPicker } from "@/components/ui/icon-picker";

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
}>["teams"];

type MultiStepViewerProps = {
  form: UseFormReturn<CreateProjectFormValues>;
  teams: UserTeams | undefined;
};

export default function MultiStepViewer({ form, teams }: MultiStepViewerProps) {
  // Définir les contenus pour les différentes étapes.
  const stepFormElements: { [key: number]: React.JSX.Element } = {
    1: (
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-bold">Informations générales</h2>

        <div className="flex items-start justify-between flex-wrap sm:flex-nowrap w-full gap-4">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Nom du projet<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Machine learning - TD 1" {...field} />
                </FormControl>
                {/* Message d'erreur si le champ est vide */}
                <FormMessage>
                  {form.formState.errors.projectName?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icône</FormLabel>
                <FormControl>
                  {/* // TODO: fix scroll dans l'icon picker */}
                  <IconPicker
                    value={field.value}
                    onValueChange={(icon) => field.onChange(icon)}
                    searchPlaceholder="Rechercher une icône"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Introduction aux réseaux de neurones"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Équipe</FormLabel>
                <TeamSwitcher
                  currentTeamID={Number(field.value)}
                  teams={teams}
                  onChange={(t) => field.onChange(t.id)}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    ),
    2: (
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-bold">Choix du mode de création</h2>
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => {
            const options = [
              {
                value: "blank",
                label: "Document vierge",
                icon: <File className="w-6 h-6" />,
                disabled: false,
              },
              {
                value: "template",
                label: "Utiliser un template",
                icon: <Layout className="w-6 h-6" />,
                disabled: true,
              },
              {
                value: "pdf",
                label: "Extraction depuis PDF",
                icon: <Upload className="w-6 h-6" />,
                disabled: true,
              },
            ];

            return (
              <FormItem className="flex flex-col gap-2 w-full py-1">
                <FormLabel>Choisissez une option</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {options.map(({ label, value, icon, disabled }) => (
                      <div key={value}>
                        <RadioGroupItem
                          value={value}
                          id={value}
                          className="peer sr-only"
                          disabled={disabled}
                        />
                        <Label
                          htmlFor={value}
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary ${
                            disabled
                              ? "cursor-not-allowed opacity-50"
                              : field.value === value
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          }`}
                        >
                          {icon}
                          <span className="mt-2 font-medium text-center text-sm">
                            {label}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    ),
    3: (
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-bold">Utiliser un template</h2>
        {/* Contenu spécifique à l'utilisation d'un template */}
      </div>
    ),
    4: (
      <div className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-bold">Extraction depuis PDF</h2>
        {/* Contenu spécifique à l'extraction depuis un PDF */}
      </div>
    ),
  };

  // Surveiller la valeur du champ "template"
  const selectedTemplate = form.watch("template");

  // Construire dynamiquement le tableau des étapes
  const [steps, setSteps] = useState<number[]>([1, 2]);
  useEffect(() => {
    if (selectedTemplate === "template") {
      setSteps([1, 2, 3]);
    } else if (selectedTemplate === "pdf") {
      setSteps([1, 2, 4]);
    } else {
      // Par défaut (par exemple "blank")
      setSteps([1, 2]);
    }
  }, [selectedTemplate]);

  // Initialiser le hook de navigation en lui passant les étapes dynamiques.
  const { currentStep, isLastStep, goToNext, goToPrevious } =
    useProjectMultiStepForm({
      initialSteps: steps,
      onStepValidation: async () => await form.trigger(),
    });

  // Récupérer le contenu de l'étape courante
  const current = stepFormElements[currentStep];

  return (
    <div className="flex flex-col gap-2 pt-3">
      <div className="flex-col-start gap-1">
        <span>
          Étape {steps.indexOf(currentStep) + 1} sur {steps.length}
        </span>
        <Progress
          value={((steps.indexOf(currentStep) + 1) / steps.length) * 100}
        />
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="flex flex-col gap-2"
        >
          {current}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between gap-3 w-full pt-3">
        {steps.indexOf(currentStep) !== 0 ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={goToPrevious}
            type="button"
          >
            Précédent
          </Button>
        ) : (
          <div />
        )}
        {isLastStep ? (
          <Button
            size="sm"
            type="submit"
            onClick={(e) => form.formState.isSubmitting && e.preventDefault()}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Valider et Soumettre
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              goToNext();
            }}
            type="button"
          >
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
}
