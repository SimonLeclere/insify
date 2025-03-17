"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCcw, Check, Clock, TriangleAlert, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSync } from "@/providers/SyncProvider";

export function SyncStatus() {
  const { status: syncState, isOffline } = useSync();

  const [isHovered, setIsHovered] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const hasMounted = useRef(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (syncState === "synced") {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      setFlashGreen(true);
      const timeout = setTimeout(() => {
        setFlashGreen(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [syncState]);

  const getDisplayText = useCallback(() => {
    if (isOffline) return "Hors ligne";

    if (syncState === "waiting") {
      return isHovered ? "En attente" : "";
    } else if (syncState === "syncing") {
      return "Sauvegarde…";
    } else if (syncState === "synced") {
      return isHovered || flashGreen ? "À jour" : "";
    } else if (syncState === "error") {
      return "Échec";
    }
    return "";
  }, [syncState, isHovered, flashGreen, isOffline]); // Inclure isOffline dans les dépendances

  // Mesure la largeur du texte pour l'animation
  useEffect(() => {
    const measureTextWidth = (text: string) => {
      const tempElement = document.createElement("span");
      tempElement.style.visibility = "hidden";
      tempElement.style.whiteSpace = "nowrap";
      tempElement.textContent = text;
      document.body.appendChild(tempElement);
      const width = tempElement.offsetWidth;
      document.body.removeChild(tempElement);
      return width;
    };

    const text = getDisplayText();
    let width = 0;

    if (text && flashGreen) width = measureTextWidth("Sauvegarde...");
    else if (text) width = measureTextWidth(text);

    setTextWidth(width);
  }, [syncState, isHovered, flashGreen, getDisplayText]);

  let Icon = Clock;
  if (isOffline) {
    Icon = WifiOff;
  } else if (syncState === "waiting") {
    Icon = Clock;
  } else if (syncState === "syncing") {
    Icon = RefreshCcw;
  } else if (syncState === "synced") {
    Icon = Check;
  } else if (syncState === "error") {
    Icon = TriangleAlert;
  }

  const colors = isOffline
    ? "bg-destructive text-white" // Gris si hors ligne
    : syncState === "waiting"
    ? "bg-muted text-muted-foreground" // Gris en attente
    : syncState === "syncing"
    ? "bg-muted text-muted-foreground" // Gris pendant la synchronisation
    : syncState === "synced" && flashGreen
    ? "bg-success text-success-foreground" // Vert si synchronisé et flash actif
    : syncState === "error"
    ? "bg-destructive text-white" // Rouge pour une erreur
    : "bg-muted text-muted-foreground"; // Gris par défaut

  const displayText = getDisplayText();

  const handleClick = () => {
    setIsHovered(true);
    // On nettoie un éventuel timeout précédent
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 2000);
  };

  return (
    <motion.div
      className={`rounded-lg px-2 py-1 text-sm text-muted-foreground flex items-center overflow-hidden h-6 justify-start transition-colors ${colors}`}
      animate={{
        width: displayText ? textWidth + 32 : 32, // 32 = largeur de l'icône
      }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Icon size={16} className="flex-shrink-0" />
      <AnimatePresence>
        {displayText && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.5 }}
            className="ml-2 whitespace-nowrap"
            style={{ width: displayText ? textWidth : 0 }}
          >
            {displayText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
