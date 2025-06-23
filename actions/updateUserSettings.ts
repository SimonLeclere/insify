"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

type UserSettingsUpdateInput = Prisma.SettingsUpdateInput;

export async function updateUserSettings(data: UserSettingsUpdateInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("User not authenticated");
  }

  try {
    const updated = await prisma.settings.update({
      where: { userId: session.user.id },
      data,
    });
    return updated;
  } catch (error) {
    throw new Error("Error updating user settings");
  }
}
