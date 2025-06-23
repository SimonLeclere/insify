import "@/app/globals.css";
import { ThemeProvider } from "@/providers/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { UserSettingsProvider } from "@/providers/UserSettingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "INSify",
  description: "Un éditeur de texte pour générer des sujets de TD",
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <UserSettingsProvider>
            {children}
          </UserSettingsProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
