import Link from "next/link";

const navigationLinks = [
  { href: "/login", label: "Iniciar sesión", primary: true },
  { href: "/register", label: "Registrarse", primary: false },
  { href: "/dashboard", label: "Ir a mis mazos", primary: false },
] as const;

function FineRule() {
  return (
    <div aria-hidden="true" className="flex items-center gap-3 text-gilt">
      <span className="h-px flex-1 bg-line" />
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2.5 14 10l7.5 2-7.5 2-2 7.5L10 14l-7.5-2L10 10l2-7.5Z" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-20">
        <section className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-forest sm:text-sm">
            <span aria-hidden="true" className="h-px w-8 bg-gilt" />
            Grimorio de estrategia · desde tu mesa
          </p>
          <h1 className="font-serif text-6xl font-medium leading-[0.92] tracking-[-0.045em] text-forest-deep sm:text-7xl lg:text-8xl">
            ArcaneStack
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl sm:leading-9">
            Un grimorio digital para ordenar tus mazos de Magic: The Gathering, pulir tus ideas y volver a cada partida con tu estrategia a mano.
          </p>
          <nav aria-label="Acceso a ArcaneStack" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {navigationLinks.map(({ href, label, primary }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex min-h-12 items-center justify-center px-6 py-3 text-center text-sm font-semibold transition-colors focus-visible:rounded-sm sm:text-base ${
                  primary
                    ? "bg-forest text-paper hover:bg-forest-deep"
                    : "border border-line bg-paper/70 text-forest-deep hover:border-forest hover:bg-paper"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </section>
        <aside aria-hidden="true" className="mx-auto w-full max-w-sm lg:ml-auto">
          <div className="rotate-1 border border-line bg-paper p-3 shadow-[0_24px_70px_-45px_rgb(32_47_40_/_45%)] sm:p-5">
            <div className="relative flex min-h-[19rem] flex-col justify-between overflow-hidden border border-line/80 p-6 sm:min-h-[25rem] sm:p-8">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at center, transparent 0 22%, rgb(168 139 88 / 13%) 22.2% 22.5%, transparent 22.7% 42%, rgb(168 139 88 / 10%) 42.2% 42.5%, transparent 42.7%)" }} />
              <div className="relative flex items-start justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">Vol. I</span>
                <svg viewBox="0 0 80 80" fill="none" className="h-16 w-16 text-gilt sm:h-20 sm:w-20">
                  <circle cx="40" cy="40" r="31" stroke="currentColor" strokeWidth="1" />
                  <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="1" />
                  <path d="M40 7v66M7 40h66M16.7 16.7l46.6 46.6m0-46.6L16.7 63.3M40 22l5 13 13 5-13 5-5 13-5-13-13-5 13-5 5-13Z" stroke="currentColor" strokeWidth="1" />
                  <circle cx="40" cy="40" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="relative">
                <FineRule />
                <p className="mt-5 font-serif text-3xl italic leading-tight text-forest-deep sm:text-4xl">Cada carta, una posibilidad.</p>
                <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">Anota · ordena · juega</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}