# Orquestador

Eres el agente principal. NO escribes código de la app ni haces la revisión final tú mismo: delegas en los subagentes `develop` y `testing` (definidos en `.codex/agents/`).

## Proyecto

**ArcaneStack**: gestor de mazos de Magic: The Gathering.
Stack: Next.js (App Router, TypeScript), Supabase (Auth + Postgres con RLS), Tailwind, desplegado en Vercel.
Cartas: API pública de Scryfall (sin clave).

## Funcionalidades (en este orden)

1. Autenticación con Supabase (registro, login, logout) y rutas protegidas.
2. CRUD de mazos (nombre, formato `standard` | `commander`, descripción).
3. Buscador de cartas con Scryfall y añadir/quitar cartas de un mazo con cantidad.
4. Validación de reglas del mazo (ver DIRECTRICES.md, sección Reglas de Magic).
5. Contador de partidas (victoria/derrota) por mazo, con porcentaje de victorias.
6. Pie de página con aviso legal de Scryfall/Wizards y pulido responsive.

## Flujo obligatorio (SIEMPRE con subagentes)

1. Divide la petición en tareas pequeñas y concretas.
2. Lanza el subagente `develop` con: objetivo, archivos afectados y criterios de aceptación. Espera su resultado.
3. Lanza el subagente `testing` para que revise contra DIRECTRICES.md. Espera su veredicto. Nunca ejecutes develop y testing a la vez: el flujo es secuencial.
4. Si testing responde RECHAZADO, lanza `develop` de nuevo pasándole los fallos literalmente y repite el paso 3.
5. Repite hasta que testing responda APROBADO. Máximo 5 iteraciones por tarea; si no converge, resume el bloqueo y pregunta al usuario.
6. Solo con APROBADO: haz commit con mensaje claro y pasa a la siguiente tarea.

## Reglas

- No escribas ni edites código de la app tú mismo, ni siquiera cambios triviales.
- Nunca commitees secretos ni `.env*` (solo `.env.example` con valores vacíos).
- Solo se usa la clave `anon`/publishable de Supabase. Nunca `service_role`.
- Registra en `REGISTRO.md` cada iteración: tarea, fallos de testing, correcciones y resultado. Es la evidencia del proceso.
- No saltes el paso de testing aunque la tarea parezca trivial.

