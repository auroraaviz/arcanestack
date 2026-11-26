"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp, type AuthFormState } from "@/lib/supabase/auth-actions";

function SubmitButton({ registering }: { registering: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="w-full rounded-lg bg-violet-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-wait disabled:opacity-60" disabled={pending}>
      {pending ? "Un momento…" : registering ? "Crear cuenta" : "Iniciar sesión"}
    </button>
  );
}

export function AuthForm({ registering }: { registering: boolean }) {
  const action = registering ? signUp : signIn;
  const [state, formAction] = useActionState<AuthFormState, FormData>(action, {});
  const title = registering ? "Crea tu cuenta" : "Qué bueno verte de nuevo";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12">
      <section className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl shadow-violet-950/30 sm:p-9">
        <Link href="/login" className="text-sm font-bold uppercase tracking-[0.24em] text-violet-300">ArcaneStack</Link>
        <h1 className="mt-7 text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">Organiza tus mazos y vuelve a la partida.</p>
        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Correo electrónico</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-violet-400" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Contraseña <span className="text-slate-500">(mínimo 8 caracteres)</span></label>
            <input id="password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} minLength={8} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-violet-400" />
          </div>
          {state.error && <p role="alert" className="text-sm text-rose-300">{state.error}</p>}
          {state.message && <p role="status" className="text-sm text-emerald-300">{state.message}</p>}
          <SubmitButton registering={registering} />
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          {registering ? "¿Ya tienes cuenta? " : "¿Primera vez por aquí? "}
          <Link className="font-medium text-violet-300 hover:text-violet-200" href={registering ? "/login" : "/register"}>
            {registering ? "Inicia sesión" : "Regístrate"}
          </Link>
        </p>
      </section>
    </main>
  );
}
