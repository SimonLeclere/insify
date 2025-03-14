// useAuth.ts
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo: string = "/auth/login") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo); // Redirection côté client
    }
  }, [status, router, redirectTo]);

  return { session, status };
}
