import NextAuth from "next-auth";
import authConfig from "./auth.config"

import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"


declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
  }
}

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ajoute l'ID de l'utilisateur au token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      if (!user?.id) return

      // Vérifie si l'utilisateur a déjà une équipe (juste par sécurité)
      const existingTeams = await prisma.teamUser.findMany({
        where: { userId: user.id },
      })

      if (existingTeams.length === 0) {
        // Crée une équipe pour l'utilisateur
        const team = await prisma.team.create({
          data: {
            name: `Équipe de ${user.firstName || "Utilisateur"}`,
            members: { connect: { id: user.id } },
            TeamUser: {
              create: {
                userId: user.id,
                role: "owner",
              },
            },
          },
        })

        console.log(`✅ Nouvelle équipe créée pour ${user.email}: ${team.name}`)
      }
    },
  },
})
