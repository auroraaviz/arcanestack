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
    <main className="flex-1 bg-page px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto w-full max-w-2xl border border-line bg-paper p-6 sm:p-10">
        <Link href={`/dashboard/decks/${deck.id}`} className="inline-flex min-h-10 items-center text-sm font-semibold text-forest-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">Volver al mazo</Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-forest">Revisión de página</p>
        <h1 className="mt-2 font-serif text-5xl font-medium tracking-tight text-ink sm:text-6xl">Editar mazo</h1>
        <p className="mt-3 leading-7 text-ink-muted">Ajusta los datos de esta lista.</p>
        <EditDeckForm deck={deck} />
      </section>
    </main>
  );
}
