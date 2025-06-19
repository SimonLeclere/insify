import { notFound, redirect } from "next/navigation";
import { getServerAuth } from "@/hooks/serverAuth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await getServerAuth();

  if (!session || !session.user) {
    return notFound();
  }

  // Fetch des données depuis la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teams: {
        select: {
          id: true, // ID de l'équipe
          name: true, // Nom de l'équipe
          TeamUser: {
            select: {
              userId: true, // Id de l'utilisateur
              role: true, // Rôle de l'utilisateur dans l'équipe
            },
          },
        },
      },
    },
  });

  if (!user) return notFound();

  // find the user's default team
  const defaultTeam = user.teams.find((team) => {
    return team.TeamUser.find(
      (u) => u.userId === user.id && u.role === "owner"
    );
  });

  if (defaultTeam) return redirect(`/t/${defaultTeam.id}`);
  return notFound()
}
