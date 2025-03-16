'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Value } from '@udecode/plate';
import { updateProject } from '@/actions/syncProjectAction';

export type SyncStatusType = 'waiting' | 'syncing' | 'synced' | 'error';

interface SyncContextProps {
  status: SyncStatusType;
  syncProject: (projectId: string, value: Value) => void;
}

const SyncContext = createContext<SyncContextProps>({
  status: 'waiting',
  syncProject: () => {},
});

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<SyncStatusType>('waiting');

  // Créez la fonction debounce pour la synchronisation
  const debouncedSyncRef = useRef(
    debounce(async (projectId: string, value: Value) => {
      try {
        setStatus('syncing');
        
        const result = await updateProject(projectId, value)

        if (result.success) setStatus('synced');
        else setStatus('error');
      } catch (error) {
        console.error('Erreur lors de la synchronisation', error);
        setStatus('error');
      }
    }, 2000)
  );

  // Fonction qui est appelée depuis n'importe quel composant pour synchroniser
  const syncProject = (projectId: string, value: Value) => {
    setStatus('waiting');  // Mettre l'état à "waiting" dès que l'utilisateur commence à modifier
    debouncedSyncRef.current(projectId, value);  // Appeler la fonction debounced
  };

  // Cleanup de debounce
  useEffect(() => {
    const debouncedSync = debouncedSyncRef.current;
    return () => {
      debouncedSync.cancel();
    };
  }, []);  

  return (
    <SyncContext.Provider value={{ status, syncProject }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);
