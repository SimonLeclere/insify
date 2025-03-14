'use client'

import { useProjectModal } from "@/components/CreateProjectModal/ProjectModalProvider";
import { Button } from "@/components/ui/button";

export function CreateProjectButton() {
    const { openModal } = useProjectModal();

    return <Button className="mt-4" onClick={openModal} >+ Nouveau projet</Button>;
}