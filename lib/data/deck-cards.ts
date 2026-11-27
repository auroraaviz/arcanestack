import "server-only";

import { getCardById } from "@/lib/scryfall";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export type DeckCard = {
  id: string;
  deck_id: string;
  user_id: string;
  scryfall_id: string;
  card_name: string;
  image_url: string | null;
  is_basic_land: boolean;
  quantity: number;
};

export type DeckCardActionResult = {
  message?: string;
  error?: string;
};

const DECK_CARD_COLUMNS =
  "id, deck_id, user_id, scryfall_id, card_name, image_url, is_basic_land, quantity";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateQuantity(quantity: number): string | null {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    return "La cantidad debe ser un número entero entre 1 y 100.";
  }
  return null;
}

/** Validación central para cantidad; aquí se pueden incorporar las reglas del formato. */
export function validateDeckCardAddition(
  requestedQuantity: number,
  currentQuantity: number,
): string | null {
  const quantityError = validateQuantity(requestedQuantity);
  if (quantityError) return quantityError;
  if (!Number.isInteger(currentQuantity) || currentQuantity < 0 || currentQuantity > 100) {
    return "La cantidad actual guardada no es válida.";
  }
  if (currentQuantity + requestedQuantity > 100) {
    return "La cantidad total de esta carta no puede superar 100.";
  }
  return null;
}

async function getOwnedDeckContext(deckId: string) {
  if (!UUID_PATTERN.test(deckId)) throw new Error("El mazo indicado no es válido.");

  const user = await getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para gestionar cartas.");

  const supabase = await createClient();
  const { data: deck, error } = await supabase
    .from("decks")
    .select("id")
    .eq("id", deckId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`No se pudo verificar el mazo: ${error.message}`);
  if (!deck) throw new Error("No se encontró el mazo o no tienes acceso a él.");

  return { supabase, userId: user.id };
}

export async function listDeckCards(deckId: string): Promise<DeckCard[]> {
  const { supabase, userId } = await getOwnedDeckContext(deckId);
  const { data, error } = await supabase
    .from("deck_cards")
    .select(DECK_CARD_COLUMNS)
    .eq("deck_id", deckId)
    .eq("user_id", userId)
    .order("card_name", { ascending: true })
    .returns<DeckCard[]>();

  if (error) throw new Error(`No se pudieron cargar las cartas: ${error.message}`);
  return data;
}

export async function addDeckCard(
  deckId: string,
  scryfallId: string,
  quantity: number,
): Promise<DeckCard> {
  if (!UUID_PATTERN.test(scryfallId)) throw new Error("El identificador de carta no es válido.");
  const quantityError = validateQuantity(quantity);
  if (quantityError) throw new Error(quantityError);
  const { supabase, userId } = await getOwnedDeckContext(deckId);

  // El servidor obtiene de nuevo todos los datos fiables de la carta.
  const card = await getCardById(scryfallId);
  const { data: existing, error: lookupError } = await supabase
    .from("deck_cards")
    .select("id, quantity")
    .eq("deck_id", deckId)
    .eq("user_id", userId)
    .eq("scryfall_id", card.scryfall_id)
    .maybeSingle();

  if (lookupError) throw new Error(`No se pudo comprobar la carta: ${lookupError.message}`);

  const currentQuantity = existing?.quantity ?? 0;
  const validationError = validateDeckCardAddition(quantity, currentQuantity);
  if (validationError) throw new Error(validationError);

  if (existing) {
    const { data, error } = await supabase
      .from("deck_cards")
      .update({ quantity: currentQuantity + quantity })
      .eq("id", existing.id)
      .eq("deck_id", deckId)
      .eq("user_id", userId)
      .select(DECK_CARD_COLUMNS)
      .single()
      .returns<DeckCard>();

    if (error) throw new Error(`No se pudo actualizar la cantidad: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase
    .from("deck_cards")
    .insert({
      deck_id: deckId,
      user_id: userId,
      scryfall_id: card.scryfall_id,
      card_name: card.name,
      image_url: card.image_url,
      is_basic_land: card.is_basic_land,
      quantity,
    })
    .select(DECK_CARD_COLUMNS)
    .single()
    .returns<DeckCard>();

  if (error) throw new Error(`No se pudo añadir la carta: ${error.message}`);
  return data;
}

export async function changeDeckCardQuantity(
  deckId: string,
  deckCardId: string,
  quantity: number,
): Promise<DeckCard | null> {
  const quantityError = validateQuantity(quantity);
  if (quantityError) throw new Error(quantityError);
  if (!UUID_PATTERN.test(deckCardId)) throw new Error("La carta indicada no es válida.");
  const { supabase, userId } = await getOwnedDeckContext(deckId);
  const { data, error } = await supabase
    .from("deck_cards")
    .update({ quantity })
    .eq("id", deckCardId)
    .eq("deck_id", deckId)
    .eq("user_id", userId)
    .select(DECK_CARD_COLUMNS)
    .maybeSingle()
    .returns<DeckCard>();

  if (error) throw new Error(`No se pudo cambiar la cantidad: ${error.message}`);
  return data;
}

export async function removeDeckCard(deckId: string, deckCardId: string): Promise<boolean> {
  if (!UUID_PATTERN.test(deckCardId)) throw new Error("La carta indicada no es válida.");
  const { supabase, userId } = await getOwnedDeckContext(deckId);
  const { data, error } = await supabase
    .from("deck_cards")
    .delete()
    .eq("id", deckCardId)
    .eq("deck_id", deckId)
    .eq("user_id", userId)
    .select("id");

  if (error) throw new Error(`No se pudo quitar la carta: ${error.message}`);
  return data.length > 0;
}
