import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AISettingsSection() {
  const [enabled, setEnabled] = useState(true);
  return (
    <section id="ai" className="scroll-mt-24">
      <Card className="max-w-2xl" style={{ pointerEvents: enabled ? "auto" : "none", opacity: enabled ? 1 : 0.5 }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Provider</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Modèle</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="claude-3">claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Clé API personnelle</label>
            <Input type="password" placeholder="••••••••••" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
