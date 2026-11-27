import Link from "next/link";

const navigationLinks = [
  { href: "/login", label: "Iniciar sesión", style: "primary" },
  { href: "/register", label: "Registrarse", style: "secondary" },
  { href: "/dashboard", label: "Ir a mis mazos", style: "secondary" },
] as const;

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-16 text-white sm:px-8">
      <section className="w-full max-w-3xl rounded-3xl border border-violet-300/20 bg-slate-900/80 p-7 shadow-2xl shadow-violet-950/30 sm:p-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
          Tu colección, bajo control
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">ArcaneStack</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">
          Un gestor de mazos de Magic: The Gathering para organizar tus ideas y tener tus listas siempre a mano.
        </p>
        <nav aria-label="Acceso a ArcaneStack" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {navigationLinks.map(({ href, label, style }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-200 ${
                style === "primary"
                  ? "bg-violet-300 text-slate-950 hover:bg-violet-200"
                  : "border border-slate-500 text-white hover:border-violet-300 hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
