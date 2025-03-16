// src/modals/CreateProjectModal.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CreateProjectForm from "@/components/CreateProjectModal/CreateProjectForm/CreateProjectForm";
import { Prisma } from "@prisma/client";


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

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teams: UserTeams | undefined;
  currentTeamID: number;
};

export default function CreateProjectModal({ isOpen, onClose, teams, currentTeamID }: CreateProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="transition-transform">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Créer un projet</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <CreateProjectForm teams={teams} currentTeamID={currentTeamID} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
