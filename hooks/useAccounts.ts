import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useAccounts() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.listAccounts();
      if (error) {
        setError(error?.message || "An error occurred while fetching accounts");
      } else {
        setData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const linkAccount = async (linkOptions: { provider: string; callbackURL: string }) => {
    try {
      const { error } = await authClient.linkSocial(linkOptions);
      fetchAccounts();
      return { success: !error, error: error?.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred" };
    }
  };

  const unlinkAccount = async (unlinkOptions: { providerId: string }) => {
    try {
      const { error } = await authClient.unlinkAccount(unlinkOptions);
      fetchAccounts();
      return { success: !error, error: error?.message };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred" };
    }
  };

  return { data, isLoading, error, linkAccount, unlinkAccount };
}