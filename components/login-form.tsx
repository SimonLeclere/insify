"use client"

import { signIn } from "@/lib/auth-client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./providersLogos/Google";
import { GithubIcon } from "./providersLogos/Github";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const handleSignIn = async (provider: string) => {
    await signIn.social({
      provider: provider,
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
      <div className="grid gap-2">
        <Button variant="outline" className="w-full" type="button" onClick={() => handleSignIn("google")}>
          <GoogleIcon />
          Login with Google
        </Button>
        <Button
          className="w-full bg-[#24292f] text-white hover:bg-[#1b1f23] hover:text-white"
          variant="outline"
          type="button"
          onClick={() => handleSignIn("github")}
        >
          <GithubIcon color="white" />
          Login with GitHub
        </Button>
      </div>
    </form>
  );
}
