import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { EditDeckForm } from "@/components/decks/edit-deck-form";
import { getDeck } from "@/lib/data/decks";

export const instant = false;

export default async function EditDeckPage({ params }: PageProps<"/dashboard/decks/[id]/edit">) {
  await connection();
  const { id } = await params;
  const deck = await getDeck(id);
  if (!deck) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100 sm:px-10">
      <section className="mx-auto w-full max-w-2xl">
        <Link href={`/dashboard/decks/${deck.id}`} className="text-sm font-medium text-violet-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Volver al mazo</Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">Editar mazo</h1>
        <EditDeckForm deck={deck} />
      </section>
    </main>
  );
}
