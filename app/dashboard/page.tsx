import { redirect } from "next/navigation";
import { connection } from "next/server";
import { signOut } from "@/lib/supabase/auth-actions";
import { getCurrentUser } from "@/lib/supabase/auth";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
          Tu colección
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bienvenido a ArcaneStack
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
          Aquí podrás organizar tus mazos de Magic y llevar un registro de tus
          partidas. Tu espacio está listo para empezar.
        </p>
        <div className="mt-10 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8 sm:p-10">
          <h2 className="text-xl font-semibold">Aún no tienes mazos</h2>
          <p className="mt-2 text-zinc-400">
            Cuando creemos tu primer mazo, aparecerá aquí.
          </p>
        </div>
      </section>
    </main>
  );
}
