import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { signOut } from "@/lib/supabase/auth-actions";
import "./globals.css";

const editorial = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const interfaceFont = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const technical = IBM_Plex_Mono({ variable: "--font-ibm-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "ArcaneStack",
  description: "Organiza tus mazos de Magic: The Gathering.",
};

function ArcaneMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="h-7 w-7 text-gilt">
      <path d="M16 2.5 18.8 13.2 29.5 16l-10.7 2.8L16 29.5l-2.8-10.7L2.5 16l10.7-2.8L16 2.5Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="3.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${editorial.variable} ${interfaceFont.variable} ${technical.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-line/80 bg-paper/80">
          <nav aria-label="Navegación principal" className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
            <Link href="/" className="group inline-flex min-h-11 items-center gap-2 text-ink focus-visible:rounded-sm">
              <ArcaneMark />
              <span className="font-serif text-2xl font-semibold tracking-tight">ArcaneStack</span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/dashboard" className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-deep underline-offset-4 hover:underline sm:text-base">
                Mis mazos
              </Link>
              <form action={signOut}>
                <button type="submit" className="inline-flex min-h-11 items-center border-l border-line pl-3 text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline sm:pl-6 sm:text-base">
                  Cerrar sesión
                </button>
              </form>
            </div>
          </nav>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="mt-auto border-t border-line bg-paper/70 px-5 py-5 text-center text-sm leading-6 text-ink-muted sm:px-8">
          <p>No afiliado a Wizards of the Coast. Datos e imágenes de Scryfall.</p>
        </footer>
      </body>
    </html>
  );
}