import "server-only";

import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export type DeckFormat = "standard" | "commander";

export type Deck = {
  id: string;
  user_id: string;
  name: string;
  format: DeckFormat;
  description: string | null;
  created_at: string;
};

export type DeckInput = {
  name: string;
  format: DeckFormat;
  description: string | null;
};

const DECK_COLUMNS = "id, user_id, name, format, description, created_at";

async function getAuthenticatedUserId() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para acceder a tus mazos.");
  }

  return user.id;
}

export async function listDecks(): Promise<Deck[]> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .select(DECK_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<Deck[]>();

  if (error) throw new Error(`No se pudieron cargar los mazos: ${error.message}`);
  return data;
}

export async function getDeck(deckId: string): Promise<Deck | null> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .select(DECK_COLUMNS)
    .eq("id", deckId)
    .eq("user_id", userId)
    .maybeSingle()
    .returns<Deck>();

  if (error) throw new Error(`No se pudo cargar el mazo: ${error.message}`);
  return data;
}

export async function createDeck(input: DeckInput): Promise<Deck> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .insert({ ...input, user_id: userId })
    .select(DECK_COLUMNS)
    .single()
    .returns<Deck>();

  if (error) throw new Error(`No se pudo crear el mazo: ${error.message}`);
  return data;
}

export async function updateDeck(
  deckId: string,
  input: DeckInput,
): Promise<Deck | null> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .update({
      name: input.name,
      format: input.format,
      description: input.description,
    })
    .eq("id", deckId)
    .eq("user_id", userId)
    .select(DECK_COLUMNS)
    .maybeSingle()
    .returns<Deck>();

  if (error) throw new Error(`No se pudo actualizar el mazo: ${error.message}`);
  return data;
}

export async function deleteDeck(deckId: string): Promise<boolean> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId)
    .eq("user_id", userId)
    .select("id");

  if (error) throw new Error(`No se pudo borrar el mazo: ${error.message}`);
  return data.length > 0;
}
