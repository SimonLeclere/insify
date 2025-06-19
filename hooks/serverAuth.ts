// serverAuth.ts
import { auth } from "@/lib/auth-better";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function getServerAuth(redirectTo: string = "/auth/login") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session && redirectTo) {
    redirect(redirectTo);
  }

  return session;
}
