import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { listDecks, type Deck } from "@/lib/data/decks";
import { getCurrentUser } from "@/lib/supabase/auth";
import { DeleteDeckForm } from "@/components/decks/delete-deck-form";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let decks: Deck[] = [];
  let hasLoadError = false;
  try {
    decks = await listDecks();
  } catch {
    hasLoadError = true;
  }

  return (
    <main className="flex-1 bg-page px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-forest">El grimorio</p>
            <h1 className="mt-3 font-serif text-5xl font-medium leading-none tracking-tight text-ink sm:text-6xl">
              Mis mazos
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">
              Tus listas, reunidas en un solo lugar para seguir tomando forma.
            </p>
          </div>
          <p className="font-mono text-xs text-ink-muted sm:pb-1">{user.email}</p>
        </div>

        <section aria-labelledby="decks-heading" className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
            <h2 id="decks-heading" className="font-serif text-3xl font-medium text-ink">Tu biblioteca</h2>
            <Link
              href="/dashboard/decks/new"
              className="inline-flex min-h-11 items-center justify-center gap-3 bg-forest px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
            >
              <span aria-hidden="true">＋</span> Crear mazo
            </Link>
          </div>
          {hasLoadError ? (
            <div role="alert" className="border border-line bg-paper p-6 sm:p-8">
              <p className="text-ink">No se pudieron cargar tus mazos. Inténtalo de nuevo.</p>
              <a href="/dashboard" className="mt-4 inline-flex min-h-10 items-center font-semibold text-forest-deep underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">
                Reintentar
              </a>
            </div>
          ) : decks.length ? (
            <ol className="divide-y divide-line border-y border-line">
              {decks.map((deck, index) => (
                <li key={deck.id} className="grid gap-x-6 gap-y-4 py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:py-8">
                  <span aria-hidden="true" className="font-mono text-xs text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h3 className="font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
                        <Link href={`/dashboard/decks/${deck.id}`} className="decoration-gilt decoration-1 underline-offset-4 hover:underline focus-visible:rounded-sm">
                          {deck.name}
                        </Link>
                      </h3>
                      <span className="inline-flex items-center border border-forest/35 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-forest-deep">
                        {deck.format}
                      </span>
                    </div>
                    <div className="mt-3 flex items-start gap-3">
                      <svg aria-hidden="true" viewBox="0 0 28 10" fill="none" className="mt-2 h-2.5 w-7 shrink-0 text-gilt">
                        <path d="M1 5h8m10 0h8M10 5l4-4 4 4-4 4-4-4Z" stroke="currentColor" strokeWidth=".8" />
                      </svg>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-ink-muted">
                        {deck.description || "Sin descripción."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <Link href={`/dashboard/decks/${deck.id}/edit`} className="inline-flex min-h-10 items-center px-3 text-sm font-semibold text-forest-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">Editar</Link>
                    <DeleteDeckForm deckId={deck.id} />
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="border-y border-line bg-paper px-6 py-10 sm:px-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-forest">Una página en blanco</p>
              <h3 className="mt-3 font-serif text-3xl font-medium text-ink">Aún no tienes mazos</h3>
              <p className="mt-2 text-ink-muted">Cuando crees el primero, aparecerá aquí.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
