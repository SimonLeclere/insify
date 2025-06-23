"use client";

import React, { useRef, useEffect, useState } from "react";
import AccountSettingsSection from "@/components/settings/AccountSettingsSection";
import GeneralSettingsSection from "@/components/settings/GeneralSettingsSection";
import AppearanceSettingsSection from "@/components/settings/AppearanceSettingsSection";
import AISettingsSection from "@/components/settings/AISettingsSection";
import DangerZoneSection from "@/components/settings/DangerZoneSection";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [isScrolling, setIsScrolling] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const aiRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const dangerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const generalRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to section on sidebar click
  const handleScrollTo = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      account: accountRef,
      general: generalRef as React.RefObject<HTMLDivElement>,
      appearance: appearanceRef as React.RefObject<HTMLDivElement>,
      ai: aiRef,
      danger: dangerRef,
    };
    setIsScrolling(true);
    setActiveSection(section);
    refs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Désactive le verrou après l'animation (durée à ajuster si besoin)
    setTimeout(() => setIsScrolling(false), 500);
  };

  // Update active section on scroll (main only)
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const sections = [
      { id: "account", ref: accountRef },
      { id: "general", ref: generalRef },
      { id: "appearance", ref: appearanceRef },
      { id: "ai", ref: aiRef },
      { id: "danger", ref: dangerRef },
    ];
    const handleScroll = () => {
      if (isScrolling) return;
      let maxVisible = 0;
      let current = "general";
      const mainRect = main.getBoundingClientRect();
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, mainRect.top);
          const visibleBottom = Math.min(rect.bottom, mainRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          if (visibleHeight > maxVisible) {
            maxVisible = visibleHeight;
            current = section.id;
          }
        }
      }
      // Si on est tout en bas, forcer la dernière section comme active
      if (main.scrollTop + main.clientHeight >= main.scrollHeight - 1) {
        current = sections[sections.length - 1].id;
      }
      setActiveSection(current);
    };
    main.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => main.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  // Permettre le scroll du main même quand la souris est sur la sidebar
  useEffect(() => {
    const sidebar = document.getElementById("settings-sidebar");
    const main = mainRef.current;
    if (!sidebar || !main) return;
    const onWheel = (e: WheelEvent) => {
      if (main) {
        main.scrollBy({ top: e.deltaY, behavior: "auto" });
        e.preventDefault();
      }
    };
    sidebar.addEventListener("wheel", onWheel, { passive: false });
    return () => sidebar.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Navigation */}
      <aside id="settings-sidebar" className="hidden md:block w-64 sticky top-0 border-r p-6 bg-background flex-shrink-0 h-full">
        <nav className="flex flex-col gap-2">
          <button
            className={`text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors ${activeSection === "account" ? "bg-muted font-semibold font-sans" : "font-normal font-sans"}`}
            style={{ fontVariationSettings: activeSection === "account" ? '"wght" 600' : '"wght" 400' }}
            onClick={() => handleScrollTo("account")}
          >
            Compte
          </button>
          <button
            className={`text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors ${activeSection === "general" ? "bg-muted font-semibold font-sans" : "font-normal font-sans"}`}
            style={{ fontVariationSettings: activeSection === "general" ? '"wght" 600' : '"wght" 400' }}
            onClick={() => handleScrollTo("general")}
          >
            Général
          </button>
          <button
            className={`text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors ${activeSection === "appearance" ? "bg-muted font-semibold font-sans" : "font-normal font-sans"}`}
            style={{ fontVariationSettings: activeSection === "appearance" ? '"wght" 600' : '"wght" 400' }}
            onClick={() => handleScrollTo("appearance")}
          >
            Apparence
          </button>
          <button
            className={`text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors ${activeSection === "ai" ? "bg-muted font-semibold font-sans" : "font-normal font-sans"}`}
            style={{ fontVariationSettings: activeSection === "ai" ? '"wght" 600' : '"wght" 400' }}
            onClick={() => handleScrollTo("ai")}
          >
            AI
          </button>
          <button
            className={`text-left px-3 py-2 rounded text-sm hover:bg-destructive/10 text-destructive transition-colors ${activeSection === "danger" ? "bg-destructive/20 font-semibold font-sans" : "font-normal font-sans"}`}
            style={{ fontVariationSettings: activeSection === "danger" ? '"wght" 600' : '"wght" 400' }}
            onClick={() => handleScrollTo("danger")}
          >
            Danger Zone
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main ref={mainRef} className="flex-1 h-full overflow-y-auto md:p-8 space-y-12 md:space-y-24">
        <div ref={accountRef}><AccountSettingsSection /></div>
        <div ref={generalRef}><GeneralSettingsSection /></div>
        <div ref={appearanceRef}><AppearanceSettingsSection /></div>
        <div ref={aiRef}><AISettingsSection /></div>
        <div ref={dangerRef}><DangerZoneSection /></div>
      </main>
    </div>
  );
}
