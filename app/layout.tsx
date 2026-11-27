import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArcaneStack",
  description: "Organiza tus mazos de Magic: The Gathering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-auto border-t border-white/10 bg-zinc-950 px-5 py-6 text-center text-sm leading-6 text-zinc-400 sm:px-8">
          <p>No afiliado a Wizards of the Coast. Datos e imágenes de Scryfall.</p>
        </footer>
      </body>
    </html>
  );
}
