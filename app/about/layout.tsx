import "../globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col gap-4">{children}</main>
  )
}
