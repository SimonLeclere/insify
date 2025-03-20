"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import debounce from "lodash.debounce";
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
  syncProject: (projectId: string, value: object) => void;
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
  const pendingSyncRef = useRef<{ projectId: string; value: object } | null>(
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
    debounce(async (projectId: string, value: object) => {
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
          if (result.data.nodes && Array.isArray(result.data.nodes)) {
            lastDataSyncedRef.current = result.data.nodes;
          }
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
  const syncProject = (projectId: string, value: object) => {
    if (!lastDataSyncedRef.current) {
      lastDataSyncedRef.current = JSON.parse(JSON.stringify(value));
      return;
    }

    if (object_equals(value, lastDataSyncedRef.current))
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function object_equals(x: any, y: any) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( const p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! object_equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( const p in y )
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
      return false;
        // allows x[ p ] to be set to undefined

  return true;
}