"use server";

import { revalidatePath } from "next/cache";
import {
  addDeckCard,
  changeDeckCardQuantity,
  removeDeckCard,
  type DeckCardActionResult,
} from "@/lib/data/deck-cards";

function readText(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  return typeof value === "string" ? value : null;
}

function readQuantity(formData: FormData): number | null {
  const value = readText(formData, "quantity");
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value);
}

export async function addDeckCardAction(
  deckId: string,
  _previousState: DeckCardActionResult,
  formData: FormData,
): Promise<DeckCardActionResult> {
  const scryfallId = readText(formData, "scryfall_id");
  const quantity = readQuantity(formData);
  if (!scryfallId) return { error: "Selecciona una carta válida." };
  if (quantity === null) return { error: "La cantidad debe ser un número entero válido." };

  try {
    await addDeckCard(deckId, scryfallId, quantity);
    revalidatePath(`/dashboard/decks/${deckId}`);
    return { message: "Carta añadida al mazo." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo añadir la carta." };
  }
}

export async function changeDeckCardQuantityAction(
  deckId: string,
  deckCardId: string,
  _previousState: DeckCardActionResult,
  formData: FormData,
): Promise<DeckCardActionResult> {
  const quantity = readQuantity(formData);
  if (quantity === null) return { error: "La cantidad debe ser un número entero válido." };

  try {
    const changed = await changeDeckCardQuantity(deckId, deckCardId, quantity);
    if (!changed) return { error: "No se encontró la carta en este mazo." };
    revalidatePath(`/dashboard/decks/${deckId}`);
    return { message: "Cantidad actualizada." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo cambiar la cantidad." };
  }
}

export async function removeDeckCardAction(
  deckId: string,
  deckCardId: string,
  _previousState: DeckCardActionResult,
): Promise<DeckCardActionResult> {
  void _previousState;
  try {
    const removed = await removeDeckCard(deckId, deckCardId);
    if (!removed) return { error: "No se encontró la carta en este mazo." };
    revalidatePath(`/dashboard/decks/${deckId}`);
    return { message: "Carta quitada del mazo." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo quitar la carta." };
  }
}
