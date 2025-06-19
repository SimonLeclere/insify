import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { auth } from "@/lib/auth-better"
import Image from "next/image"
import { UserSession } from "@/components/user-session"
import { headers } from "next/headers"

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            INSify
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs text-center">
            {session && session.user ? (
              <UserSession user={{
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image || undefined
              }} />
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="https://picsum.photos/748/768"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "100%" }}
          alt="Image"
          unoptimized
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
