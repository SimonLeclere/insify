import "@/app/globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

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
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
