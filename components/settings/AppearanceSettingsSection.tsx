import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSettings } from "@/providers/UserSettingsContext";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";

export default function AppearanceSettingsSection() {
  const { settings, loading, error, setSettings } = useUserSettings();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  
  if (error) return <div>Erreur lors du chargement des paramètres</div>;

  return (
    <section id="appearance" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block mb-1 font-medium">Thème</label>
            <Select
              value={mounted ? theme : ""}
              onValueChange={theme => {
                setTheme(theme);
              }}
              disabled={loading || !settings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="block mb-1 font-medium">Couleur d&apos;accentuation</label>
            <Select
              value={settings?.accentColor || ""}
              onValueChange={accentColor => settings && setSettings({ ...settings, accentColor })}
              disabled={loading || !settings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une couleur" />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: automatically list colors */}
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="blue">Bleu</SelectItem>
                <SelectItem value="green">Vert</SelectItem>
                <SelectItem value="purple">Violet</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="block mb-1 font-medium">Police par défaut de l’éditeur</label>
            <Select
              value={settings?.editorFont || ""}
              onValueChange={editorFont => settings && setSettings({ ...settings, editorFont })}
              disabled={loading || !settings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une police" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="mono">Mono</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
