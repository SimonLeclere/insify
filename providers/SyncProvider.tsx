"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import debounce from "lodash.debounce";
import { Value } from "@udecode/plate";
import { updateProject } from "@/actions/syncProjectAction";
import { JsonValue } from "@prisma/client/runtime/library";

export type SyncStatusType =
  | "waiting"
  | "syncing"
  | "synced"
  | "error"
  | "offline";

interface SyncContextProps {
  status: SyncStatusType;
  isOffline: boolean;
  syncProject: (projectId: string, value: Value) => void;
}

const SyncContext = createContext<SyncContextProps>({
  status: "waiting",
  isOffline: false,
  syncProject: () => {},
});

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<SyncStatusType>("synced");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const lastDataSyncedRef = useRef<JsonValue[] | undefined>(undefined);
  const pendingSyncRef = useRef<{ projectId: string; value: Value } | null>(
    null
  );

  // Ref pour stocker la valeur actuelle de isOffline et éviter le problème de fermeture
  const isOfflineRef = useRef(isOffline);

  useEffect(() => {
    isOfflineRef.current = isOffline;
  }, [isOffline]);

  // Détection du statut réseau
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine);

      const updateOnlineStatus = () => {
        setIsOffline(!navigator.onLine);

        if (navigator.onLine && pendingSyncRef.current) {
          const { projectId, value } = pendingSyncRef.current;
          pendingSyncRef.current = null;
          syncProject(projectId, value);
        }
      };

      const interval = setInterval(updateOnlineStatus, 5000); // Vérification toutes les 5 secondes
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  // Définition de la fonction debounce
  const debouncedSyncRef = useRef(
    debounce(async (projectId: string, value: Value) => {
      if (isOfflineRef.current) {
        setStatus("offline");
        pendingSyncRef.current = { projectId, value };
        return;
      }

      try {
        setStatus("syncing");
        const result = await updateProject(projectId, value);

        if (result.success && result.data) {
          setStatus("synced");
          if (result.data.nodes) lastDataSyncedRef.current = result.data.nodes;
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Erreur lors de la synchronisation", error);
        setStatus("error");
      }
    }, 2000)
  );

  // Fonction de synchronisation
  const syncProject = (projectId: string, value: Value) => {
    if (!lastDataSyncedRef.current) {
      lastDataSyncedRef.current = JSON.parse(JSON.stringify(value)); // TODO: Trouver mieux
      return;
    }

    if (JSON.stringify(value) === JSON.stringify(lastDataSyncedRef.current))
      return;

    setStatus("waiting"); // Met à jour le statut en "waiting"
    debouncedSyncRef.current(projectId, value);
  };

  // Cleanup du debounce
  useEffect(() => {
    const debouncedSync = debouncedSyncRef.current;
    return () => {
      debouncedSync.cancel();
    };
  }, []);

  return (
    <SyncContext.Provider value={{ status, isOffline, syncProject }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);
