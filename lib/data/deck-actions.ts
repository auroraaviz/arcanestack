"use server";

import { redirect } from "next/navigation";
import { createDeck, deleteDeck, updateDeck, type DeckFormat } from "@/lib/data/decks";

type CreateDeckState = {
  errors?: {
    name?: string;
    format?: string;
    description?: string;
  };
  message?: string;
};

export type EditDeckState = CreateDeckState;

export type DeleteDeckState = {
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

function readDeckFields(formData: FormData) {
  const name = readTextField(formData, "name")?.trim() ?? "";
  const format = readTextField(formData, "format");
  const rawDescription = readTextField(formData, "description");
  const description = rawDescription?.trim() ?? "";
  const errors: NonNullable<EditDeckState["errors"]> = {};

  if (!name) errors.name = "El nombre es obligatorio.";
  else if (name.length > 80) errors.name = "El nombre no puede superar 80 caracteres.";
  if (!isDeckFormat(format)) errors.format = "Selecciona un formato válido.";
  if (rawDescription === null) errors.description = "La descripción no es válida.";
  else if (description.length > 500) errors.description = "La descripción no puede superar 500 caracteres.";

  return { name, format, description, errors };
}

export async function editDeckAction(
  _previousState: EditDeckState,
  formData: FormData,
): Promise<EditDeckState> {
  const deckId = readTextField(formData, "deckId");
  if (!deckId) return { message: "No se pudo identificar el mazo." };

  const fields = readDeckFields(formData);
  if (Object.keys(fields.errors).length) return { errors: fields.errors };
  if (!isDeckFormat(fields.format)) return { errors: { format: "Selecciona un formato válido." } };

  try {
    const updatedDeck = await updateDeck(deckId, {
      name: fields.name,
      format: fields.format,
      description: fields.description || null,
    });
    if (!updatedDeck) return { message: "No se encontró ese mazo." };
  } catch {
    return { message: "No se pudo actualizar el mazo. Inténtalo de nuevo." };
  }

  redirect(`/dashboard/decks/${deckId}`);
}

export async function deleteDeckAction(
  _previousState: DeleteDeckState,
  formData: FormData,
): Promise<DeleteDeckState> {
  const deckId = readTextField(formData, "deckId");
  if (!deckId) return { message: "No se pudo identificar el mazo." };

  try {
    const deleted = await deleteDeck(deckId);
    if (!deleted) return { message: "No se encontró ese mazo." };
  } catch {
    return { message: "No se pudo borrar el mazo. Inténtalo de nuevo." };
  }

  redirect("/dashboard");
}
