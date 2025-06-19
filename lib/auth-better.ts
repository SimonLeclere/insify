import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { createAuthMiddleware } from "better-auth/api"
import { type MiddlewareContext, type MiddlewareOptions, type AuthContext } from "better-auth"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx: MiddlewareContext<MiddlewareOptions, AuthContext>) => {
      
      const user = ctx.context?.returned?.user
      if (user && user.id) {
        try {
          const existingTeams = await prisma.teamUser.findMany({ where: { userId: user.id } })
          if (existingTeams.length === 0) {
            await prisma.team.create({
              data: {
                name: `Équipe de ${user.name || "Utilisateur"}`,
                members: { connect: { id: user.id } },
                TeamUser: {
                  create: {
                    userId: user.id,
                    role: "owner",
                  },
                },
              },
            })
          }
        } catch (error) {
          console.error("Erreur lors de la création de l'équipe:", error)
        }
      }
    }),
  },
})

export type Session = typeof auth.$Infer.Session
