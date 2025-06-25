import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleIcon } from "../../providersLogos/Google";
import { GithubIcon } from "../../providersLogos/Github";
import { useAccounts } from "@/hooks/useAccounts";
import { toast } from "sonner";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMounted } from "@/hooks/useMounted";

const providers = {
  google: {
    name: "Google",
    icon: <GoogleIcon className="w-8 h-8" />
  },
  github: {
    name: "GitHub",
    icon: <GithubIcon className="w-8 h-8" />
  },
};

export function AccountProvidersSection() {
  const { data: accounts, isLoading, linkAccount, unlinkAccount } = useAccounts();
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const connected = searchParams.get("connected");

  // Gestion du toast de connexion
  // (on laisse la redirection ici car elle concerne l'ensemble de la page)
  useEffect(() => {
    if (connected === "true") {
      toast.success("Compte connecté avec succès !");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("connected");
      const newUrl = `${pathname}?${newSearchParams.toString()}${window.location.hash}`;
      router.push(newUrl);
    }
  }, [connected, searchParams, router, pathname, isLoading]);

  if (isLoading || !mounted) {
    return (
      <div>
        <div className="font-medium mb-2">Méthodes de connexion</div>
        <div className="space-y-2">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg border bg-muted/30 w-full">
              <Avatar className="w-8 h-8 flex-shrink-0 flex items-center justify-center self-center">
                <Skeleton className="w-8 h-8 rounded-full" />
              </Avatar>
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-0.5">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-44" />
              </div>
              <div className="flex flex-col justify-center gap-2 w-full sm:w-auto">
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  return (
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
  );
}
