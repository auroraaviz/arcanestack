"use server";

import { redirect } from "next/navigation";
import { createDeck, type DeckFormat } from "@/lib/data/decks";

type CreateDeckState = {
  errors?: {
    name?: string;
    format?: string;
    description?: string;
  };
  message?: string;
};

function readTextField(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  return typeof value === "string" ? value : null;
}

function isDeckFormat(value: string | null): value is DeckFormat {
  return value === "standard" || value === "commander";
}

export async function createDeckAction(
  _previousState: CreateDeckState,
  formData: FormData,
): Promise<CreateDeckState> {
  const rawName = readTextField(formData, "name");
  const rawFormat = readTextField(formData, "format");
  const rawDescription = readTextField(formData, "description");
  const name = rawName?.trim() ?? "";
  const description = rawDescription?.trim() ?? "";
  const errors: NonNullable<CreateDeckState["errors"]> = {};

  if (!name) errors.name = "El nombre es obligatorio.";
  else if (name.length > 80) errors.name = "El nombre no puede superar 80 caracteres.";

  if (!isDeckFormat(rawFormat)) {
    errors.format = "Selecciona un formato válido.";
  }

  if (rawDescription === null) {
    errors.description = "La descripción no es válida.";
  } else if (description.length > 500) {
    errors.description = "La descripción no puede superar 500 caracteres.";
  }

  if (Object.keys(errors).length > 0) return { errors };
  if (!isDeckFormat(rawFormat)) return { errors: { format: "Selecciona un formato válido." } };

  try {
    await createDeck({
      name,
      format: rawFormat,
      description: description || null,
    });
  } catch {
    return { message: "No se pudo crear el mazo. Inténtalo de nuevo." };
  }

  redirect("/dashboard");
}
