import { NextResponse } from "next/server";
import { searchCards } from "@/lib/scryfall";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json(
      { error: "La búsqueda debe tener entre 2 y 100 caracteres." },
      { status: 400 },
    );
  }

  try {
    const results = await searchCards(query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron buscar cartas en Scryfall. Inténtalo de nuevo." },
      { status: 502 },
    );
  }
}
