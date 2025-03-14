// serverAuth.ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getServerAuth(redirectTo: string = "/auth/login") {
  const session = await auth();

  if (!session && redirectTo) {
    redirect(redirectTo); // Redirection immédiate côté serveur
  }

  return session;
}
