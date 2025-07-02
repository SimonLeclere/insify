import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Info } from "lucide-react";
import { useUserSettings } from "@/providers/UserSettingsContext";
import React, { useState, useEffect } from "react";
import { ShineBorder } from "../ui/shine-border";

export default function AISettingsSection() {
  const { settings, loading, error, setSettings } = useUserSettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState<string>("");

  const [pendingAiEnabled, setPendingAiEnabled] = useState<boolean | null>();

  if (error) return <div>Erreur lors du chargement des paramètres</div>;

  React.useEffect(() => {
    setPendingAiEnabled(settings?.aiEnabled ?? false);
  }, [settings?.aiEnabled]);

  const testConfiguration = async () => {
    if (!settings?.aiProvider || !settings?.aiModel || !settings?.aiApiKey) return;
    setTestStatus("loading");
    setTestMessage("");
    try {
      const res = await fetch(`/api/ai/models/${settings.aiModel}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setTestStatus("success");
        setTestMessage("Configuration AI valide !");
        setTimeout(() => {
          setTestStatus("idle");
          setTestMessage("");
        }, 3000);
        settings && setSettings({ ...settings, aiEnabled: true });
      } else {
        setTestStatus("error");
        setTestMessage("Configuration invalide.");
        setTimeout(() => {
          setTestStatus("idle");
          setTestMessage("");
        }, 3000);
      }
    } catch (e: any) {
      setTestStatus("error");
      setTestMessage("Erreur réseau");
      setTimeout(() => {
        setTestStatus("idle");
        setTestMessage("");
      }, 3000);
    }
  };

  return (
    <section id="ai" className="scroll-mt-24">
      <Card className="max-w-2xl relative overflow-hidden">
        <ShineBorder
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          borderWidth={2}
          duration={10}
          className={`transition-opacity duration-1000 ${
            settings?.aiEnabled ? "opacity-100" : "opacity-0"
          }`}
        />
        <CardHeader>
          <label
            htmlFor="aiEnabled"
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <CardTitle>AI</CardTitle>
            <Switch
              id="aiEnabled"
              checked={!!pendingAiEnabled}
              onCheckedChange={(v) => {
                if (!settings) return;
                if (!v) {
                  setPendingAiEnabled(false);
                  setSettings({ ...settings, aiEnabled: false });
                } else {
                  setPendingAiEnabled(true);
                  // On n'active pas tout de suite, il faut passer le test !
                }
              }}
              disabled={loading || !settings}
            />
          </label>
        </CardHeader>
        <CardContent
          className="space-y-6"
          style={{
            pointerEvents: settings?.aiEnabled || pendingAiEnabled ? "auto" : "none",
            opacity: settings?.aiEnabled || pendingAiEnabled ? 1 : 0.5,
          }}
        >
          <div className="flex flex-col gap-4 sm:gap-unset sm:flex-row sm:justify-between">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Provider</label>
              <Select
                value={settings?.aiProvider ?? undefined}
                onValueChange={(provider) =>
                  settings && setSettings({ ...settings, aiProvider: provider })
                }
                disabled={loading || !settings}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Modèle</label>
              <Select
                value={settings?.aiModel ?? undefined}
                onValueChange={(model) =>
                  settings && setSettings({ ...settings, aiModel: model })
                }
                disabled={loading || !settings}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-3.3-70b-versatile">
                    llama-3.3-70b-versatile
                  </SelectItem>
                  <SelectItem value="llama-3.1-8b-instant">
                    llama-3.1-8b-instant
                  </SelectItem>
                  <SelectItem value="gemma2-9b-it">
                    gemma2-9b-it
                  </SelectItem>
                  <SelectItem value="deepseek-r1-distill-llama-70b">
                    deepseek-r1-distill-llama-70b
                  </SelectItem>
                  <SelectItem value="meta-llama/llama-4-maverick-17b-128e-instruct">
                    meta-llama/llama-4-maverick-17b-128e-instruct
                  </SelectItem>
                  <SelectItem value="meta-llama/llama-4-scout-17b-16e-instruct">
                    meta-llama/llama-4-scout-17b-16e-instruct
                  </SelectItem>
                  <SelectItem value="qwen-qwq-32b">
                    qwen-qwq-32b
                  </SelectItem>
                  <SelectItem value="qwen/qwen3-32b">
                    qwen/qwen3-32b
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Clé API personnelle
            </label>
            <div className="relative flex items-center">
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="••••••••••"
                value={settings?.aiApiKey ?? ""}
                onChange={(e) =>
                  settings &&
                  setSettings({ ...settings, aiApiKey: e.target.value })
                }
                disabled={loading || !settings}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 text-muted-foreground hover:text-foreground focus:outline-none"
                onClick={() => setShowApiKey((v) => !v)}
                aria-label={
                  showApiKey ? "Masquer la clé API" : "Afficher la clé API"
                }
              >
                {showApiKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Info className="size-4 ml-1" />
              Votre clé API sera chiffrée et stockée de manière sécurisée sur
              notre serveur.
            </p>
          </div>
          <div className="flex justify-between">
            <div className="mr-2 text-sm flex items-center gap-2">
              {testStatus !== "idle" && (
                <>
                  {testStatus === "success" && (
                    <span className="text-green-600">{testMessage}</span>
                  )}
                  {testStatus === "error" && (
                    <span className="text-red-600">{testMessage}</span>
                  )}
                </>
              )}
            </div>
            <Button
              variant="outline"
              onClick={testConfiguration}
              disabled={
                loading ||
                !settings ||
                !settings.aiProvider ||
                !settings.aiModel ||
                !settings.aiApiKey ||
                testStatus === "loading"
              }
            >
              {testStatus === "loading"
                ? "Test en cours..."
                : "Tester la configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
