"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AddCardForm } from "@/components/decks/add-card-form";
import type { ScryfallCard } from "@/lib/scryfall";

type SearchState = "idle" | "loading" | "success" | "empty" | "error";
type SearchPayload = { results?: ScryfallCard[]; error?: string };

export function CardSearch({ deckId }: { deckId: string }) {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [status, setStatus] = useState<SearchState>("idle");
  const [error, setError] = useState("");
  const searchTerm = query.trim();

  useEffect(() => {
    if (searchTerm.length < 2) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch(`/api/cards/search?q=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as SearchPayload;
        if (!response.ok) throw new Error(payload.error || "No se pudo completar la búsqueda.");

        const results = payload.results ?? [];
        setCards(results);
        setStatus(results.length === 0 ? "empty" : "success");
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(fetchError instanceof Error ? fetchError.message : "No se pudo completar la búsqueda.");
        setStatus("error");
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchTerm]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setStatus("idle");
    setError("");
    if (value.trim().length < 2) setCards([]);
  }

  return (
    <section aria-labelledby="card-search-heading" className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Índice de Scryfall</p>
      <h2 id="card-search-heading" className="mt-1 font-serif text-3xl font-medium text-forest-deep">Buscar cartas</h2>
      <label htmlFor="card-search-query" className="mt-5 block text-sm font-semibold text-ink">Nombre o texto de carta</label>
      <input
        id="card-search-query"
        type="search"
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        minLength={2}
        maxLength={100}
        autoComplete="off"
        aria-describedby="card-search-help"
        className="mt-2 min-h-12 w-full rounded-md border border-line bg-paper px-4 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        placeholder="Ej. Lightning Bolt"
      />
      <p id="card-search-help" className="mt-2 text-sm text-ink-muted">Escribe al menos 2 caracteres.</p>
      <div className="mt-4 [&>p]:!text-ink-muted" aria-live="polite" aria-busy={status === "loading"}>
        {searchTerm.length < 2 ? <p className="text-ink-muted">Escribe para buscar cartas.</p> : null}
        {status === "loading" ? <p className="text-forest-deep">Buscando cartas…</p> : null}
        {status === "empty" ? <p className="text-ink-muted">No se encontraron cartas.</p> : null}
        {status === "error" ? <p role="alert" className="text-red-900">{error}</p> : null}
      </div>
      {status === "success" ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.scryfall_id} className="flex min-w-0 gap-4 border border-line bg-paper p-4 shadow-[0_2px_8px_rgb(36_37_34/4%)]">
              {card.image_url ? (
                <Image src={card.image_url} alt={card.name} width={112} height={156} className="h-auto w-24 shrink-0 object-contain" />
              ) : (
                <div className="flex h-[134px] w-24 shrink-0 items-center justify-center border border-line bg-page p-2 text-center text-xs text-ink-muted" aria-label={`Imagen no disponible: ${card.name}`}>
                  Imagen no disponible
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-semibold leading-snug text-forest-deep">{card.name}</h3>
                <p className="mt-2 text-sm leading-5 text-ink-muted">{card.type_line}</p>
                <AddCardForm deckId={deckId} scryfallId={card.scryfall_id} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
