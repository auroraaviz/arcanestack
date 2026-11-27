import Image from "next/image";
import type { DeckCard } from "@/lib/data/deck-cards";
import { DeckCardControls } from "@/components/decks/deck-card-controls";

export function DeckCardList({ deckId, cards }: { deckId: string; cards: DeckCard[] }) {
  if (cards.length === 0) {
    return (
      <p className="mt-5 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-zinc-300">
        Este mazo todavía no tiene cartas.
      </p>
    );
  }

  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <li key={card.id} className="flex min-w-0 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.card_name}
              width={140}
              height={196}
              className="h-auto w-20 shrink-0 self-start object-contain sm:w-24"
            />
          ) : (
            <div
              role="img"
              aria-label={`Imagen no disponible: ${card.card_name}`}
              className="flex h-[112px] w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 p-2 text-center text-xs text-zinc-400 sm:h-[134px] sm:w-24"
            >
              Imagen no disponible
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="break-words font-semibold leading-snug">{card.card_name}</h3>
            <p className="mt-1 text-sm text-zinc-300">En el mazo: {card.quantity}</p>
            <DeckCardControls key={`${card.id}-${card.quantity}`} deckId={deckId} card={card} />
          </div>
        </li>
      ))}
    </ul>
  );
}
