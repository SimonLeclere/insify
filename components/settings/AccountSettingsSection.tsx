import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleIcon } from "../providersLogos/Google";
import { useAccounts } from "@/hooks/useAccounts";
import { GithubIcon } from "../providersLogos/Github";
import { useSearchParams } from 'next/navigation'
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const providers = {
  google: {
    name: "Google",
    icon: <GoogleIcon className="w-4 h-4" />
  },
  github: {
    name: "GitHub",
    icon: <GithubIcon className="w-4 h-4" />
  },
};

export default function AccountSettingsSection() {

  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { data: accounts, isLoading: isAccountsListLoading, linkAccount, unlinkAccount } = useAccounts();

  const user = session?.user;

  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname()
  const connected = searchParams.get("connected");
  
  useEffect(() => {
    if (connected === "true") {
      toast.success("Compte connecté avec succès !");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("connected");
      const newUrl = `${pathname}?${newSearchParams.toString()}${window.location.hash}`;
      router.push(newUrl);
    }
  }, [connected, searchParams, isAccountsListLoading]);


  if (isSessionPending) {
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

  if (!session || (!user && !isSessionPending)) {
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
              <div className="text-muted-foreground text-sm">{user?.email}</div>
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
              {Object.values(providers).map((provider) => {

                const connected = accounts?.find(acc => acc.provider === provider.name.toLowerCase());

                return (
                  <div key={provider.name} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg border bg-muted/30 w-full">
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                      <Avatar className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center self-center">
                        {provider.icon || <span className="text-lg">{provider.name[0]}</span>}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {connected
                            ? `Connecté depuis le ${new Date(connected.createdAt).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}`
                            : `Connectez votre compte ${provider.name}`}
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:ml-auto flex-shrink-0">
                      {connected ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={accounts?.length === 1}
                          onClick={async () => {
                            const { success, error } = await unlinkAccount({ providerId: provider.name.toLowerCase() });
                            if (!success) {
                              toast.error(error || "Erreur lors de la déconnexion");
                            } else {
                              toast.success("Compte déconnecté avec succès");
                            }
                          }}
                          className="text-destructive border-destructive w-full sm:w-auto"
                        >
                          Déconnecter
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={async () => {
                            const { success, error } = await linkAccount({
                              provider: provider.name.toLowerCase(),
                              callbackURL: process.env.NEXT_PUBLIC_BASE_URL + "/settings?connected=true#account"
                            });
                            if (!success) {
                              toast.error(error || "Erreur lors de la connexion");
                            }
                          }}
                        >
                          Connecter
                        </Button>
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
