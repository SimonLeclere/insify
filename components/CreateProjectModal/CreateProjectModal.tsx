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

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentTeamID: number;
};

export default function CreateProjectModal({ isOpen, onClose, currentTeamID }: CreateProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="transition-transform">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Créer un projet</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <CreateProjectForm currentTeamID={currentTeamID} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
