"use client"

import { signIn } from "@/lib/auth-client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./providersLogos/Google";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <form className={cn("flex flex-col gap-6 z-100", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Se connecter</h1>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Choisissez un des fournisseurs ci-dessous
        </span>
      </div>
      <div className="grid gap-6">
        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
          <GoogleIcon />
          Login with Google
        </Button>
      </div>
    </form>
  );
}
