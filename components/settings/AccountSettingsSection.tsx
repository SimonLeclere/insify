import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Fake user data for demo
const user = {
  avatar: "", // URL or leave blank for placeholder
  firstName: "Simon",
  lastName: "Leclere",
  email: "simon@example.com",
  providers: [
    { id: "google", name: "Google", email: "simon@gmail.com", connected: true },
    { id: "github", name: "GitHub", email: null, connected: false },
    { id: "email", name: "Email", email: "simon@example.com", connected: true },
  ],
};

export default function AccountSettingsSection() {
  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  return (
    <section id="account" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Infos utilisateur */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              {/* Placeholder avatar */}
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{user.firstName[0]}{user.lastName[0]}</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              {edit ? (
                <div className="flex gap-2">
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" />
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" />
                </div>
              ) : (
                <div className="font-medium text-lg">{user.firstName} {user.lastName}</div>
              )}
              <div className="text-muted-foreground text-sm">{user.email}</div>
            </div>
            {edit ? (
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" onClick={() => setEdit(false)}>Annuler</Button>
                <Button size="sm" onClick={() => setEdit(false)}>Enregistrer</Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEdit(true)}>Éditer</Button>
            )}
          </div>

          <Separator />

          {/* Méthodes de connexion */}
          <div>
            <div className="font-medium mb-2">Méthodes de connexion</div>
            <div className="space-y-2">
              {user.providers.map((provider, idx) => {
                const connectedCount = user.providers.filter(p => p.connected).length;
                return (
                  <div key={provider.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 rounded border bg-muted/30 w-full">
                    {/* Logo placeholder */}
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-0 sm:mr-2 mb-2 sm:mb-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {provider.connected
                          ? provider.email || user.email
                          : `Connectez votre compte ${provider.name}`}
                      </div>
                    </div>
                    {provider.connected ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={connectedCount === 1}
                        className="text-destructive border-destructive w-full sm:w-auto"
                      >
                        Déconnecter
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full sm:w-auto">Connecter</Button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Vous devez avoir au moins une méthode connectée.</div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
