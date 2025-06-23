import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleIcon } from "../providersLogos/Google";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const providers = [
    { id: "google", name: "Google", email: "simon@gmail.com", connected: true, icon: <GoogleIcon /> },
    { id: "github", name: "GitHub", email: null, connected: false },
  ]

export default function AccountSettingsSection() {

  const { data: session, isPending } = authClient.useSession()
  
  const user = session?.user;
  
  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const allEmails = providers.map(p => p.email).filter(Boolean);
  const [selectedEmail, setSelectedEmail] = useState(user?.email || allEmails[0] || "");
  
  if (isPending) {
    return (
      <section id="account" className="scroll-mt-24">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Skeletons for loading state */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 text-xl font-bold">
                <Skeleton className="w-16 h-16" />
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <Separator />
            <div>
              <div className="font-medium mb-3">
                <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg border bg-muted/30 w-full">
                    <Avatar className="h-8 w-8 flex-shrink-0 mx-0 sm:mx-2 mb-1 sm:mb-0">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </Avatar>
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-0.5">
                      <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse mb-1" />
                      <div className="h-3 w-44 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="flex flex-col justify-center gap-2 w-full sm:w-auto">
                      <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!session || (!user && !isPending)) {
    return redirect("/auth/login");
  }

  return (
    <section id="account" className="scroll-mt-24">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Infos utilisateur */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar */}
            <Avatar className="w-30 h-30 sm:w-16 sm:h-16 text-xl font-bold">
              <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
              <AvatarFallback className="rounded-lg">{user?.name}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              {edit ? (
                <div className="flex gap-2">
                  <Input className="w-30 h-7" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" />
                  <Input className="w-30 h-7" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" />
                </div>
              ) : (
                <div className="font-medium text-lg">{user?.firstName} {user?.lastName}</div>
              )}
              {edit ? (
                <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                  <SelectTrigger className="w-56 h-7 text-sm">
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      provider.email ? (
                        <SelectItem key={provider.email} value={provider.email}>{provider.email}</SelectItem>
                      ) : null
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-muted-foreground text-sm">{user?.email}</div>
              )}
            </div>
            {edit ? (
              <div className="flex gap-2">
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
              {providers.map((provider) => {
                const connectedCount = providers.filter(p => p.connected).length;
                return (
                  <div key={provider.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg border bg-muted/30 w-full">
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                    {/* TODO: Logo placeholder */}
                    <Avatar className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center self-center">
                      {provider.icon || <span className="text-lg">{provider.name[0]}</span>}
                    </Avatar>
                      {/* Provider name and email */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {provider.connected
                            ? provider.email || user?.email
                            : `Connectez votre compte ${provider.name}`}
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-auto flex-shrink-0">
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
