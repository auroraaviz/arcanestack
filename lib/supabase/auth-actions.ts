"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error?: string; message?: string };

function readCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return { error: "Introduce un correo electrónico válido." } as const;
  }
  if (typeof password !== "string" || password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." } as const;
  }
  return { email: email.trim(), password } as const;
}

export async function signIn(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  if ("error" in credentials) return credentials;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) return { error: "No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo." };
  redirect("/dashboard");
}

export async function signUp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  if ("error" in credentials) return credentials;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) return { error: "No se pudo crear la cuenta. Inténtalo de nuevo." };
  if (!data.session) {
    return { message: "Revisa tu correo para confirmar la cuenta y después inicia sesión." };
  }
  redirect("/dashboard");
}
