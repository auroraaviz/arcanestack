import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { listDecks, type Deck } from "@/lib/data/decks";
import { signOut } from "@/lib/supabase/auth-actions";
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
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-10">
        <a href="/dashboard" className="text-lg font-semibold tracking-wide">
          <span className="text-violet-300">Arcane</span>Stack
        </a>
        <div className="flex items-center gap-4">
          <p className="max-w-[min(45vw,20rem)] truncate text-sm text-zinc-300">
            {user.email}
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16 sm:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
          Tu colección
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bienvenido a ArcaneStack
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
          Organiza tus mazos de Magic y lleva un registro de tus partidas.
        </p>
        <section aria-labelledby="decks-heading" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="decks-heading" className="text-2xl font-semibold">Mis mazos</h2>
            <Link
              href="/dashboard/decks/new"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              Crear mazo
            </Link>
          </div>
          {hasLoadError ? (
            <div role="alert" className="mt-5 rounded-2xl border border-red-300/30 bg-red-950/40 p-6">
              <p className="text-red-100">No se pudieron cargar tus mazos. Inténtalo de nuevo.</p>
              <a
                href="/dashboard"
                className="mt-4 inline-flex rounded-lg border border-red-200/40 px-4 py-2 font-medium text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Reintentar
              </a>
            </div>
          ) : decks.length ? (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {decks.map((deck) => (
                <li key={deck.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-xl font-semibold">
                    <Link href={`/dashboard/decks/${deck.id}`} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
                      {deck.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm font-medium capitalize text-violet-300">{deck.format}</p>
                  <p className="mt-3 whitespace-pre-wrap text-zinc-300">
                    {deck.description || "Sin descripción."}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link href={`/dashboard/decks/${deck.id}/edit`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Editar</Link>
                    <DeleteDeckForm deckId={deck.id} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8 sm:p-10">
              <h3 className="text-xl font-semibold">Aún no tienes mazos</h3>
              <p className="mt-2 text-zinc-400">Cuando crees tu primer mazo, aparecerá aquí.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
