"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp, type AuthFormState } from "@/lib/supabase/auth-actions";

function SubmitButton({ registering }: { registering: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="min-h-12 w-full bg-forest px-4 py-3 font-semibold text-paper transition-colors hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest disabled:cursor-wait disabled:opacity-60" disabled={pending}>
      {pending ? "Un momento…" : registering ? "Crear cuenta" : "Iniciar sesión"}
    </button>
  );
}

export function AuthForm({ registering }: { registering: boolean }) {
  const action = registering ? signUp : signIn;
  const [state, formAction] = useActionState<AuthFormState, FormData>(action, {});
  const title = registering ? "Crea tu cuenta" : "Qué bueno verte de nuevo";

  return (
    <main className="flex flex-1 items-center px-5 py-12 sm:px-8 sm:py-16">
      <section className="relative mx-auto w-full max-w-md border border-line bg-paper p-6 sm:p-9">
        <svg aria-hidden="true" viewBox="0 0 28 10" fill="none" className="absolute right-6 top-7 h-2.5 w-7 text-gilt sm:right-9 sm:top-9">
          <path d="M1 5h8m10 0h8M10 5l4-4 4 4-4 4-4-4Z" stroke="currentColor" strokeWidth=".8" />
        </svg>
        <Link href="/login" className="inline-flex min-h-10 items-center font-mono text-xs font-semibold uppercase tracking-[0.16em] text-forest-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">ArcaneStack</Link>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-forest">{registering ? "Abrir el grimorio" : "Acceso"}</p>
        <h1 className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">Organiza tus mazos y vuelve a la partida.</p>
        <form action={formAction} className="mt-8 space-y-5 border-t border-line pt-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">Correo electrónico</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="min-h-12 w-full border border-line bg-page px-3 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">Contraseña <span className="font-normal text-ink-muted">(mínimo 8 caracteres)</span></label>
            <input id="password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} minLength={8} required className="min-h-12 w-full border border-line bg-page px-3 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest" />
          </div>
          {state.error && <p role="alert" className="border border-red-800 bg-red-50 p-3 text-sm text-red-900">{state.error}</p>}
          {state.message && <p role="status" className="border border-forest bg-paper p-3 text-sm text-forest-deep">{state.message}</p>}
          <SubmitButton registering={registering} />
        </form>
        <p className="mt-6 text-center text-sm text-ink-muted">
          {registering ? "¿Ya tienes cuenta? " : "¿Primera vez por aquí? "}
          <Link className="font-semibold text-forest-deep underline-offset-4 hover:underline" href={registering ? "/login" : "/register"}>
            {registering ? "Inicia sesión" : "Regístrate"}
          </Link>
        </p>
      </section>
    </main>
  );
}
