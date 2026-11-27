import "server-only";

export type ScryfallCard = {
  scryfall_id: string;
  name: string;
  image_url: string | null;
  type_line: string;
  is_basic_land: boolean;
};

type ApiImageUris = {
  normal?: unknown;
};

type ApiCard = {
  id?: unknown;
  name?: unknown;
  type_line?: unknown;
  image_uris?: ApiImageUris | null;
  card_faces?: Array<{ image_uris?: ApiImageUris | null }> | null;
};

type ApiSearchResponse = {
  data?: unknown;
};

const SCRYFALL_API = "https://api.scryfall.com";
const MINIMUM_REQUEST_INTERVAL_MS = 100;
const REQUEST_HEADERS = {
  Accept: "application/json",
  "User-Agent": "ArcaneStack/1.0",
};

let requestQueue: Promise<void> = Promise.resolve();
let lastRequestStartedAt = 0;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pacedFetch(url: string): Promise<Response> {
  const previousRequest = requestQueue;
  let releaseRequest!: () => void;
  requestQueue = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });

  await previousRequest;
  try {
    const delay = Math.max(
      0,
      MINIMUM_REQUEST_INTERVAL_MS - (Date.now() - lastRequestStartedAt),
    );
    if (delay > 0) await wait(delay);
    lastRequestStartedAt = Date.now();

    return await fetch(url, {
      headers: REQUEST_HEADERS,
      cache: "no-store",
    });
  } finally {
    releaseRequest();
  }
}

function normalizeCard(card: ApiCard): ScryfallCard {
  if (
    typeof card.id !== "string" ||
    typeof card.name !== "string" ||
    typeof card.type_line !== "string"
  ) {
    throw new Error("Scryfall devolvió una carta con datos incompletos.");
  }

  const normalImage = card.image_uris?.normal;
  const firstFaceImage = card.card_faces?.[0]?.image_uris?.normal;
  const image = typeof normalImage === "string" ? normalImage : firstFaceImage;
  const typeLine = card.type_line;

  return {
    scryfall_id: card.id,
    name: card.name,
    image_url: typeof image === "string" ? image : null,
    type_line: typeLine,
    is_basic_land: typeLine.includes("Basic Land"),
  };
}

async function readApiError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "details" in body &&
      typeof body.details === "string"
    ) {
      return body.details;
    }
  } catch {
    // Usa el estado HTTP como mensaje alternativo si el cuerpo no es JSON.
  }

  return `Scryfall respondió con estado ${response.status}.`;
}

export async function searchCards(query: string): Promise<ScryfallCard[]> {
  const url = new URL(`${SCRYFALL_API}/cards/search`);
  url.searchParams.set("q", query);
  const response = await pacedFetch(url.toString());

  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const body = (await response.json()) as ApiSearchResponse;
  if (!Array.isArray(body.data)) {
    throw new Error("Scryfall devolvió una respuesta de búsqueda no válida.");
  }

  return body.data.map((card: ApiCard) => normalizeCard(card));
}

export async function getCardById(scryfallId: string): Promise<ScryfallCard> {
  const response = await pacedFetch(
    `${SCRYFALL_API}/cards/${encodeURIComponent(scryfallId)}`,
  );
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return normalizeCard((await response.json()) as ApiCard);
}
