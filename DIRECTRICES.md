# Directrices (las verifica Testing)

## Calidad general

1. `npm run lint` y `npm run build` terminan sin errores.
2. TypeScript sin `any` ni `@ts-ignore`.
3. Sin `console.log` olvidados.
4. Componentes de menos de 150 líneas, un archivo por componente.

## Seguridad

5. Ninguna clave en el código. `.env*` en `.gitignore`; solo existe `.env.example` sin valores reales.
6. Solo se usa la clave `anon`/publishable de Supabase. Nunca `service_role`.
7. Todas las tablas tienen RLS activado y políticas por usuario (`auth.uid() = user_id`). El SQL está versionado en `supabase/schema.sql`.
8. Las rutas privadas comprueban la sesión en el servidor.

## Arquitectura

9. Todo acceso a Supabase pasa por `lib/supabase/` o `lib/data/`. Nada de consultas sueltas en componentes.
10. Todo acceso a Scryfall pasa por `lib/scryfall.ts`, que se ejecuta en el servidor (Route Handler o Server Action).
11. Server Components por defecto; `"use client"` solo si hay estado o eventos.

## Scryfall (condiciones de uso de la API)

12. Cada petición lleva cabecera `User-Agent` con el nombre de la app y cabecera `Accept`.
13. Máximo ~10 peticiones por segundo: hay que aplicar debounce en el buscador y pausa entre llamadas.
14. Las imágenes de cartas no se recortan, deforman ni se les superpone nada.
15. Al guardar una carta en un mazo se guarda `scryfall_id`, nombre e imagen, para no depender de Scryfall al mostrar el mazo.

## Reglas de Magic (validación en servidor, no solo en el cliente)

16. Máximo 4 copias de una misma carta, salvo tierras básicas (Plains, Island, Swamp, Mountain, Forest).
17. Formato `standard`: mínimo 60 cartas en el mazo principal.
18. Formato `commander`: exactamente 100 cartas y una sola copia de cada carta (salvo tierras básicas).
19. El estado de validez del mazo se muestra al usuario con mensajes claros.

## UX

20. Cada pantalla con datos maneja estados de carga, vacío y error.
21. Formularios con validación y mensajes de error visibles.
22. Diseño responsive (móvil y escritorio).
23. Accesibilidad básica: labels en inputs, `alt` en imágenes, botones con texto o `aria-label`.
24. El pie de página incluye: "No afiliado a Wizards of the Coast. Datos e imágenes de Scryfall."

## Seguridad de datos (añadidas tras los rechazos de testing)

25. Las actualizaciones a la base de datos construyen el objeto con campos explícitos; nunca aceptan `user_id` ni campos no listados.
26. El servidor no confía en datos de carta enviados por el cliente: al añadir una carta, vuelve a consultar Scryfall por `scryfall_id` para obtener nombre, imagen y tipo.
