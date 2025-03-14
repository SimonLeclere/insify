import type { NextAuthConfig } from "next-auth"
import Google, { GoogleProfile } from "next-auth/providers/google"
 
export default {
  providers: [
    Google({  profile: (_profile: GoogleProfile) => {
      return {
        id: _profile.sub,
        name: _profile.name,
        firstName: _profile.given_name,
        lastName: _profile.family_name,
        email: _profile.email,
        image: _profile.picture
      };
    }})
  ],
} satisfies NextAuthConfig