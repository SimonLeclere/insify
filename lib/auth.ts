import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins/organization"
import { admin } from "better-auth/plugins/admin"
import { oAuthProxy } from "better-auth/plugins/oauth-proxy"
import { prisma } from "./prisma"
import {
  ac,
  owner as ownerRole,
  admin as adminRole,
  member as memberRole
} from "@/lib/permissions"

export const auth = betterAuth({

  appName: process.env.NEXT_PUBLIC_APP_NAME || "INSify",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {

          const u = user as typeof user & { firstName: string, lastName: string };

          // Create a personal team for the user
          const name = `Équipe de ${u.firstName}`;
          const slug = `personal-${u.id}`;

          const organization = await prisma.organization.create({
            data: {
              name: name,
              slug: slug,
              members: {
                create: {
                  userId: u.id,
                  role: "ownerRole",
                },
              },
            },
          });

          console.log(`✅ Created team "${organization.name}" for user ${u.email}`);

          // Create a Settings record for the user
          await prisma.settings.create({
            data: {
              userId: u.id,
            }
          });
          console.log(`✅ Created settings for user ${u.email}`);
        }
      }
    },
    session: {
      create: {
        before: async (session) => {
          let organization = await prisma.organization.findFirst({
            where: {
              members: {
                some: {
                  userId: session.userId,
                  role: "owner",
                },
              },
            },
          });

          if (!organization) {
            organization = await prisma.organization.findFirst({
              where: {
                members: {
                  some: {
                    userId: session.userId,
                  },
                },
              },
            });
          }

          return {
            data: {
              ...session,
              activeOrganizationId: organization?.id ?? null,
            },
          };
        },
      },
    },
  },

  advanced: {
    database: {
      generateId: false,
    },
  },

  plugins: [
    organization({
      ac,
      roles: {
        ownerRole,
        adminRole,
        memberRole
      }
    }),
    admin(),
    oAuthProxy({
      productionURL: process.env.NEXT_PUBLIC_PRODUCTION_URL
    }),
    nextCookies(),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: "https://simonsnotion.vercel.app/api/auth/callback/google",
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: "https://simonsnotion.vercel.app/api/auth/callback/github",
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.name.split(" ")[0],
          lastName: profile.name.split(" ")[1],
        };
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
      allowDifferentEmails: true,
    },
  },

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        defaultValue: "",
      },
      lastName: {
        type: "string",
        required: true,
        defaultValue: "",
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type Member = typeof auth.$Infer.Member
export type Organization = typeof auth.$Infer.Organization
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization
export type Invitation = typeof auth.$Infer.Invitation