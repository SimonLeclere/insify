"use client"

import { signOut } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface UserSessionProps {
  user: User
}

export function UserSession({ user }: UserSessionProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.image || ""} alt={user.name || ""} />
        <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <p className="text-lg font-medium">
        Vous êtes connecté en tant que <br />
        <span className="font-bold">{user.name}</span>
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => handleSignOut()}>
          Se déconnecter
        </Button>
        <Button onClick={() => router.push("/")}>Continuer</Button>
      </div>
    </div>
  )
}
