import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"
import { organizationClient, adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { ac, owner as ownerRole, admin as adminRole, member as memberRole } from "@/lib/permissions"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:4242",
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        member: memberRole
      }
    }),
    adminClient(),
    inferAdditionalFields<typeof auth>()
  ]
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession
} = authClient