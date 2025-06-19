// useAuth.ts
"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo: string = "/auth/login") {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push(redirectTo); // Redirection côté client
    }
  }, [session, isPending, router, redirectTo]);

  return { session, status: isPending ? "loading" : session ? "authenticated" : "unauthenticated" };
}
