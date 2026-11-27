# ArcaneStack

Gestor de mazos de *Magic: The Gathering*. Permite crear mazos (Standard o Commander), buscar cartas en Scryfall, añadirlas con cantidad y ver si el mazo cumple las reglas de su formato.

**App en producción:** https://arcanestack.vercel.app

## Stack

- Next.js (App Router, TypeScript) y Tailwind
- Supabase: autenticación y Postgres con RLS por usuario (`supabase/schema.sql`)
- API pública de Scryfall, llamada solo desde el servidor
- Desplegado en Vercel

## Funcionalidades

- Registro, login y logout; rutas privadas comprobadas en servidor
- CRUD de mazos (nombre, formato y descripción)
- Buscador de cartas con debounce y imágenes sin recortar
- Reglas validadas en servidor: máximo 4 copias (1 en Commander) salvo tierras básicas, y máximo 100 cartas en Commander
- Estado de validez del mazo: Standard con mínimo 60 cartas, Commander con exactamente 100

## Cómo se construyó: equipo de 3 agentes (Codex)

| Agente | Archivo | Papel |
|---|---|---|
| Orquestador | `AGENTS.md` | Divide el trabajo, delega, hace commit solo con APROBADO |
| Develop | `.codex/agents/develop.toml` | Programa siguiendo sus normas |
| Testing | `.codex/agents/testing.toml` | Revisa contra `DIRECTRICES.md` y responde APROBADO o RECHAZADO |

Cada tarea sigue el ciclo develop → testing → correcciones → commit. Cada iteración, con los fallos reales detectados por Testing y sus correcciones, está en [`REGISTRO.md`](./REGISTRO.md).

## Ejecutar en local

```bash
npm install
cp .env.example .env.local   # rellena con las claves anon de tu proyecto Supabase
npm run dev
```

Ejecuta `supabase/schema.sql` en el SQL Editor de tu proyecto. Solo se usa la clave `anon`/publishable.

## Limitaciones conocidas

- La pausa entre peticiones a Scryfall se mantiene por instancia del servidor, no de forma global.
- No hay tests automáticos: la revisión la hace el subagente Testing con lint, build y las directrices.
- El contador de partidas no está implementado.

*No afiliado a Wizards of the Coast. Datos e imágenes de Scryfall.*
