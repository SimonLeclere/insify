"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserSettings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("User not authenticated");
  }
  
  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw new Error("Error loading user settings");
  }
}
