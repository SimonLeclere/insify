import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSettings } from "@/providers/UserSettingsContext";

export default function GeneralSettingsSection() {
  const { settings, loading, error, setSettings } = useUserSettings();
  if (error) return <div>Erreur lors du chargement des paramètres</div>;

  return (
    <section id="general" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Général</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block mb-1 font-medium">Langue de l&apos;interface</label>
            <Select
              value={settings?.language ?? undefined}
              onValueChange={lang => settings && setSettings({ ...settings, language: lang })}
              disabled={loading || !settings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une langue" />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: automatically list languages */}
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label htmlFor="rawMarkdown" className="flex items-center justify-between cursor-pointer select-none py-1">
            <span>Afficher le bouton &quot;Affichage markdown brut&quot;</span>
            <Switch
              id="rawMarkdown"
              checked={!!settings?.showRawMarkdown}
              onCheckedChange={v => settings && setSettings({ ...settings, showRawMarkdown: v })}
              disabled={loading || !settings}
            />
          </label>
          <label htmlFor="homepageHints" className="flex items-center justify-between cursor-pointer select-none py-1">
            <span>Afficher les astuces sur la page d&quot;accueil</span>
            <Switch
              id="homepageHints"
              checked={!!settings?.homepageHints}
              onCheckedChange={v => settings && setSettings({ ...settings, homepageHints: v })}
              disabled={loading || !settings}
            />
          </label>
          <label htmlFor="showToc" className="flex items-center justify-between cursor-pointer select-none py-1">
            <span>Afficher la table des matières latérale</span>
            <Switch
              id="showToc"
              checked={!!settings?.showToc}
              onCheckedChange={v => settings && setSettings({ ...settings, showToc: v })}
              disabled={loading || !settings}
            />
          </label>
          <label htmlFor="showStats" className="flex items-center justify-between cursor-pointer select-none py-1">
            <span>Afficher les statistiques du document</span>
            <Switch
              id="showStats"
              checked={!!settings?.showStats}
              onCheckedChange={v => settings && setSettings({ ...settings, showStats: v })}
              disabled={loading || !settings}
            />
          </label>
        </CardContent>
      </Card>
    </section>
  );
}
