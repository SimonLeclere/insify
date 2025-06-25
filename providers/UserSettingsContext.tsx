"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Prisma } from "@prisma/client";
import { getUserSettings } from "@/actions/getUserSettings";
import { updateUserSettings } from "@/actions/updateUserSettings";
import { toast } from "sonner";

type UserSettings = Prisma.SettingsGetPayload<object>;

type UserSettingsContextType = {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  setSettings: (settings: UserSettings) => void;
  refetch: () => void;
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const user = session?.user;
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserSettings();
      setSettings(data);
    } catch (e: any) {
      setError(e.message);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const setSettingsAndUpdate = async (newSettings: UserSettings) => {
    if (!user?.id) return;
    const previousSettings = settings;
    setSettings(newSettings); // Optimistic update
    try {
      await updateUserSettings(newSettings);
    } catch (e: any) {
      setSettings(previousSettings!); // revert
      toast.error("Erreur lors de la mise à jour des paramètres.");
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <UserSettingsContext.Provider value={{ settings, loading, error, setSettings: setSettingsAndUpdate, refetch: fetchSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
};
