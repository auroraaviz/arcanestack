import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getDeck } from "@/lib/data/decks";
import { listDeckCards, type DeckCard } from "@/lib/data/deck-cards";
import { DeleteDeckForm } from "@/components/decks/delete-deck-form";
import { CardSearch } from "@/components/decks/card-search";
import { DeckCardList } from "@/components/decks/deck-card-list";
import { validateDeckSize } from "@/lib/deck-validation";

export const instant = false;

export default async function DeckDetailPage({ params }: PageProps<"/dashboard/decks/[id]">) {
  await connection();
  const { id } = await params;
  const deck = await getDeck(id);
  if (!deck) notFound();

  let cards: DeckCard[] = [];
  let cardsLoadError = false;
  try {
    cards = await listDeckCards(id);
  } catch {
    cardsLoadError = true;
  }
  const deckValidity = cardsLoadError ? null : validateDeckSize(deck.format, cards);

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
        <section aria-labelledby="deck-cards-heading" className="mt-10 border-t border-white/10 pt-8">
          <h2 id="deck-cards-heading" className="text-2xl font-semibold">Cartas del mazo</h2>
          {deckValidity ? (
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-xl border p-4 ${
                deckValidity.isValid
                  ? "border-emerald-300/30 bg-emerald-950/30 text-emerald-100"
                  : "border-amber-300/30 bg-amber-950/30 text-amber-100"
              }`}
            >
              <span className="font-semibold">Total de cartas: {deckValidity.totalCards}.</span>{" "}
              {deckValidity.message}
            </p>
          ) : null}
          {cardsLoadError ? (
            <div role="alert" className="mt-5 rounded-2xl border border-red-300/30 bg-red-950/40 p-6">
              <p className="text-red-100">No se pudieron cargar las cartas de este mazo.</p>
              <p role="status" className="mt-2 text-red-100">
                No se puede calcular la validez del mazo sin sus cartas.
              </p>
              <Link
                href={`/dashboard/decks/${deck.id}`}
                className="mt-4 inline-flex rounded-lg border border-red-200/40 px-4 py-2 font-medium text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Reintentar
              </Link>
            </div>
          ) : (
            <DeckCardList deckId={deck.id} cards={cards} />
          )}
        </section>
      </article>
    </main>
  );
}
