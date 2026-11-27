# Registro de iteraciones

## Funcionalidad 1: autenticación con Supabase

### Tarea 1 — clientes SSR y protección de rutas

- Iteración 1: añadidos clientes browser/server, renovación de sesión mediante `proxy.ts` y protección de `/dashboard` comprobada también en su layout de servidor.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

### Tarea 2 — registro e inicio de sesión

- Iteración 1: añadidos formularios accesibles para registro/login y acciones de servidor con validación de credenciales y soporte para confirmación por correo.
- Fallos de testing: RECHAZADA por Directriz 9: `app/dashboard/layout.tsx` consultaba `auth.getUser()` directamente fuera de `lib/supabase/` o `lib/data/`.
- Correcciones: movida la consulta a `getCurrentUser()` en `lib/supabase/auth.ts`; el layout ahora llama al helper.
- Resultado: RECHAZADA; se corrigió en la iteración siguiente.
- Iteración 2: revisada la corrección de `getCurrentUser()` y los formularios de registro/login.
- Fallos de testing: ninguno.
- Correcciones: aplicada la corrección descrita en la iteración 1.
- Resultado: APROBADO tras `npm run lint` y `npm run build` sin errores; no hay script `test` configurado.

### Tarea 3 — área privada y cierre de sesión

- Iteración 1: añadida página protegida `/dashboard` con estado vacío inicial, cuenta autenticada y formulario de logout mediante acción de servidor.
- Fallos de testing: ninguno. El primer `npm run build` durante el desarrollo detectó datos dinámicos fuera de Suspense al prerenderizar el dashboard.
- Correcciones: se marcó `/dashboard` con `instant = false` para renderizarlo bajo demanda.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

### Incidente posterior a la Tarea 3: Date.now() inestable al renderizar el dashboard

- Error reportado: Next.js 16.4.6 muestra “Blocking RouteServer — unstable value Date.now() while prerendering” con `DashboardLayout` en el stack. La búsqueda de `Date.now()`, `new Date()` y `Date(` en el código de la aplicación no encontró coincidencias.
- Causa identificada: `DashboardLayout` llamaba `getCurrentUser()` durante la fase de prerender. Esa función llama a `supabase.auth.getUser()`; el cliente `@supabase/auth-js` lee `Date.now()` al evaluar la expiración de una sesión con `expires_at`. `instant = false` está admitido por Next 16.4.6, pero configura la previsualización instantánea y no aplaza esta lectura de hora durante el prerender.
- Corrección: `DashboardLayout` y `DashboardPage` esperan `connection()` de `next/server` antes de consultar Supabase (commits `3cedffa` y `e237dd5`). Así, la verificación autenticada se ejecuta para la petición y sigue protegida en servidor; Cache Components permanece habilitado.
- Verificación: APROBADO por testing. `npm run lint` y `npm run build` pasan; el build deja `/dashboard` como ruta dinámica con Cache Components.
- Comprobación manual: registro, inicio de sesión, acceso al dashboard, cierre de sesión y nuevo inicio de sesión verificados en local.

## Portada ArcaneStack

### Tarea 1 — página de inicio estática

- Iteración 1: sustituida la plantilla de Create Next App por una portada responsive y accesible con el nombre ArcaneStack, una descripción del gestor de mazos de Magic: The Gathering y enlaces de acceso a login, registro y mazos. La página no consulta la sesión ni usa APIs.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; la raíz se genera como ruta estática. No hay script `test` configurado.

## Funcionalidad 2: CRUD de mazos

### Tarea 1 — capa de datos

- Iteración 1: añadidos `listDecks()`, `getDeck(deckId)`, `createDeck(input)`, `updateDeck(deckId, input)` y `deleteDeck(deckId)` en `lib/data/decks.ts`. Cada operación obtiene el usuario con `getCurrentUser()` en el servidor y filtra por su ID o lo asigna al crear; ninguna acepta `user_id` como entrada. Errores de Supabase se propagan con mensajes de contexto.
- Iteración 1: APROBADO por lint/build, pero RECHAZADO por testing.
- Fallos de testing: [Directriz nº 6] `lib/data/decks.ts:78-83`: `updateDeck()` pasa `input` directamente a `.update()`. Un objeto de entrada con una propiedad adicional `user_id` podría modificar el dueño del mazo. Construye el objeto de actualización explícitamente con `name`, `format` y `description`, y nunca actualices `user_id`.
- Correcciones: la iteración 2 construye el objeto de actualización explícitamente con `name`, `format` y `description`, excluyendo cualquier propiedad adicional.
- Resultado iteración 1: RECHAZADO.
- Iteración 2: aplicada la corrección para limitar los campos actualizados.
- Fallos de testing: ninguno.
- Correcciones: se construye explícitamente el objeto de actualización con `name`, `format` y `description`, por lo que no se aceptan campos adicionales como `user_id`.
- Resultado iteración 2: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores.

### Tarea 2 — listado de mazos

- Iteración 1: sustituido el estado vacío de `/dashboard` por listado con nombre, formato y descripción; se añadieron estados vacío, error con reintento y carga accesible. La consulta espera `connection()` y usa `listDecks()` desde `lib/data/decks.ts`.
- Fallos de testing: ninguno.
- Correcciones: el build detectó una variable `decks` posiblemente no inicializada; se tipó como `Deck[]` y se inicializó vacía antes de la consulta.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; el dashboard se mantiene dinámico y el estado de carga queda disponible.

### Tarea 3 — crear mazo

- Iteración 1: añadida ruta de creación y formulario accesible; la acción valida en servidor nombre (1–80), formato y descripción (máximo 500) antes de llamar a `createDeck()`. `user_id` se obtiene en la capa de datos desde la sesión.
- Fallos de testing: ninguno.
- Correcciones: el primer build detectó el estado inicial sin tipo del formulario y después una lectura dinámica durante el prerender de la ruta. Se tipó el estado y la página espera `connection()`.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; `/dashboard/decks/new` se genera como ruta dinámica. No hay script `test` configurado.

### Tarea 4 — editar, borrar y detalle del mazo

- Iteración 1: añadidas las páginas de detalle y edición, acciones de edición y borrado con validación/propiedad en servidor, confirmación antes del borrado y enlaces desde el listado. Las páginas de detalle y edición esperan `connection()` antes de consultar el mazo y muestran not-found para mazos inexistentes o ajenos.
- Fallos de testing: [Directriz nº 20] `app/dashboard/decks/[id]/loading.tsx`: no existe un estado de carga para las páginas de detalle y edición, que consultan Supabase. Añade un `loading.tsx` accesible en el segmento `[id]`.
- Correcciones: añadida `app/dashboard/decks/[id]/loading.tsx` con indicador accesible `role="status"`, `aria-busy` y texto para lectores de pantalla.
- Resultado iteración 1: RECHAZADO.
- Iteración 2: aplicada la corrección para cargar los datos de detalle y edición con un estado accesible.
- Fallos de testing: ninguno.
- Correcciones: añadida `app/dashboard/decks/[id]/loading.tsx` con indicador accesible `role="status"`, `aria-busy` y texto para lectores de pantalla.
- Resultado iteración 2: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; las rutas quedan dinámicas.

## Funcionalidad 3: buscador de cartas y cartas del mazo

### Tarea 1 — cliente Scryfall y Route Handler

- Iteración 1: añadidos búsqueda y consulta por id en `lib/scryfall.ts`, con normalización de cartas, cabeceras requeridas y cola que respeta una pausa mínima de 100 ms; añadido `GET /api/cards/search` con sesión y validación de `q`.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

### Tarea 2 — datos y acciones de cartas del mazo

- Iteración 1: añadidas funciones para listar, añadir, actualizar cantidad y quitar cartas. Cada operación verifica sesión y propiedad del mazo; al añadir, el servidor reconsulta Scryfall por id y guarda campos explícitos. La validación de cantidad está separada para incorporar las reglas de Magic en la funcionalidad 4.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

### Tarea 3 — buscador de cartas

- Iteración 1: añadido buscador con debounce de 400 ms, estados accesibles, resultados con imágenes de Scryfall y formulario para añadir una cantidad al mazo; configurado el dominio remoto de imágenes.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

### Tarea 4 — lista de cartas del mazo

- Iteración 1: añadida en el detalle una lista de cartas con imágenes, nombre y cantidad; se agregaron controles para cambiar cantidad y quitar, junto con estados vacío, error con reintento y carga mediante el estado de la ruta.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

## Aviso legal global

### Tarea 1 — pie de página global

- Iteración 1: añadido un `<footer>` estático al layout raíz con el aviso legal exacto de Wizards of the Coast y Scryfall; no consulta sesión ni APIs.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteración inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.

## Reglas de Magic

### Tarea 1 — validacion de copias y tamano maximo Commander

- Iteracion 1: ampliada la validacion de `lib/data/deck-cards.ts` para rechazar mas de cuatro copias en Standard, mas de una en Commander salvo tierras basicas y mas de 100 cartas en Commander, tanto al anadir como al cambiar cantidad. El formato y las cantidades existentes se leen desde la base de datos en el servidor; el tamano minimo/exacto del mazo no bloquea escrituras.
- Fallos de testing: ninguno.
- Correcciones: no aplican en la iteracion inicial.
- Resultado: APROBADO. `npm run lint` y `npm run build` finalizaron sin errores; no hay script `test` configurado.
