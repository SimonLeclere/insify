import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneralSettingsSection() {
  return (
    <section id="general" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Général</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Langue de l&apos;interface</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <span>Afficher le bouton &quot;Affichage markdown brut&quot;</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Afficher la table des matières latérale</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Mode développeur</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Afficher stats du document en bas</span>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
