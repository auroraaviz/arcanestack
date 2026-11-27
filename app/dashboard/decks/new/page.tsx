import Link from "next/link";
import { connection } from "next/server";
import { CreateDeckForm } from "@/components/decks/create-deck-form";

export const instant = false;

export default async function NewDeckPage() {
  await connection();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100 sm:px-10">
      <section className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-violet-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        >
          Volver a mis mazos
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">Crear mazo</h1>
        <p className="mt-3 text-zinc-300">Añade un mazo para organizar tus cartas y estrategias.</p>
        <CreateDeckForm />
      </section>
    </main>
  );
}
