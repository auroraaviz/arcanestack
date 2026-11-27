import Link from "next/link";
import { connection } from "next/server";
import { CreateDeckForm } from "@/components/decks/create-deck-form";

export const instant = false;

export default async function NewDeckPage() {
  await connection();

  return (
    <main className="flex-1 bg-page px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto w-full max-w-2xl border border-line bg-paper p-6 sm:p-10">
        <Link
          href="/dashboard"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-forest-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          Volver a mis mazos
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-forest">Nueva entrada</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink sm:text-6xl">Crear mazo</h1>
        <p className="mt-3 max-w-lg leading-7 text-ink-muted">Añade un mazo para organizar tus cartas y estrategias.</p>
        <CreateDeckForm />
      </section>
    </main>
  );
}
