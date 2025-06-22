import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppearanceSettingsSection() {
  return (
    <section id="appearance" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Thème</label>
            <RadioGroup defaultValue="system" className="flex gap-4">
              <RadioGroupItem value="light" id="theme-light" />
              <label htmlFor="theme-light">Clair</label>
              <RadioGroupItem value="dark" id="theme-dark" />
              <label htmlFor="theme-dark">Sombre</label>
              <RadioGroupItem value="system" id="theme-system" />
              <label htmlFor="theme-system">Système</label>
            </RadioGroup>
          </div>
          <div>
            <label className="block mb-1 font-medium">Couleur d&apos;accentuation</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une couleur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Bleu</SelectItem>
                <SelectItem value="green">Vert</SelectItem>
                <SelectItem value="purple">Violet</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Police par défaut de l’éditeur</label>
            <Select>
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
