import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getDeck } from "@/lib/data/decks";
import { DeleteDeckForm } from "@/components/decks/delete-deck-form";
import { CardSearch } from "@/components/decks/card-search";

export const instant = false;

export default async function DeckDetailPage({ params }: PageProps<"/dashboard/decks/[id]">) {
  await connection();
  const { id } = await params;
  const deck = await getDeck(id);
  if (!deck) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100 sm:px-10">
      <article className="mx-auto w-full max-w-3xl">
        <Link href="/dashboard" className="text-sm font-medium text-violet-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Volver a mis mazos</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Detalle del mazo</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{deck.name}</h1>
        <p className="mt-4 text-lg font-medium capitalize text-violet-200">Formato: {deck.format}</p>
        <section aria-labelledby="description-heading" className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 id="description-heading" className="text-xl font-semibold">Descripción</h2>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-300">{deck.description || "Sin descripción."}</p>
        </section>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={`/dashboard/decks/${deck.id}/edit`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950 hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Editar mazo</Link>
          <DeleteDeckForm deckId={deck.id} />
        </div>
        <CardSearch deckId={deck.id} />
      </article>
    </main>
  );
}
