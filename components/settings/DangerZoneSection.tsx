import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DangerZoneSection() {
  return (
    <section id="danger" className="scroll-mt-24">
      <Card className="max-w-2xl border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button variant="outline" className="w-full">Se déconnecter</Button>
          <Separator />
          <Button variant="destructive" className="w-full" onClick={() => window.confirm("Réinitialiser le compte ?") && alert("Compte réinitialisé !")}>Réinitialiser le compte</Button>
          <Button variant="destructive" className="w-full" onClick={() => window.confirm("Supprimer le compte ? Cette action est irréversible.") && alert("Compte supprimé !")}>Supprimer le compte</Button>
        </CardContent>
      </Card>
    </section>
  );
}
