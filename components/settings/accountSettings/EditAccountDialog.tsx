import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type EditAccountFormValues = {
  usualName?: string;
  firstName?: string;
  lastName?: string;
  image?: string; // base64
};

type EditAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: EditAccountFormValues;
};

export function EditAccountDialog({ open, onOpenChange, initialValues }: EditAccountDialogProps) {
  const form = useForm<EditAccountFormValues>({
    defaultValues: initialValues,
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  // Ajout de la validation pour éviter les champs vides
  const validateNotEmpty = (value: string | undefined) => {
    return value && value.trim() !== "" ? true : "Ce champ ne peut pas être vide";
  };

  // Gestion de l'upload d'avatar, conversion en base64 et crop carré (PNG, pas de compression JPEG)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!ev.target?.result) return;
      img.onload = () => {
        // Création d'un canvas carré 96x96px (avatar basse résolution)
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Dessine l'image centrée et crop carré
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        // Export PNG (pas de compression JPEG)
        const dataUrl = canvas.toDataURL('image/png');
        form.setValue('image', dataUrl, { shouldDirty: true });
      };
      img.src = ev.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: EditAccountFormValues) => {
    const { error } = await authClient.updateUser({
      name: values.usualName,
      firstName: values.firstName,
      lastName: values.lastName,
      image: values.image,
    });

    if (error) {
      return toast.error("Erreur lors de la mise à jour du profil");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Éditer le profil</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar field moved to top with pencil icon overlay */}
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="relative w-16 h-16 group focus:outline-none"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        tabIndex={0}
                        aria-label="Changer l'avatar"
                      >
                        <Avatar className="w-16 h-16 border">
                          <AvatarImage src={field.value || undefined} alt="avatar" />
                          <AvatarFallback className="rounded-lg select-none">
                            {/* Affiche la première lettre du nom usuel ou un point d'interrogation */}
                            {form.getValues("usualName")?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 border shadow group-hover:bg-gray-100">
                          {/* Lucide pencil icon SVG */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M15.232 5.232 18.768 8.768M16.5 3.964a2.618 2.618 0 1 1 3.707 3.707L7.5 20.378l-4.243.707.707-4.243Z"/></svg>
                        </span>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Usual Name */}
            <FormField
              name="usualName"
              control={form.control}
              rules={{ validate: validateNotEmpty }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom usuel</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* First Name */}
            <FormField
              name="firstName"
              control={form.control}
              rules={{ validate: validateNotEmpty }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name */}
            <FormField
              name="lastName"
              control={form.control}
              rules={{ validate: validateNotEmpty }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de famille</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
