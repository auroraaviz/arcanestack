-- ArcaneStack: esquema de base de datos

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  format text not null check (format in ('standard', 'commander')),
  description text check (char_length(description) <= 500),
  created_at timestamptz not null default now()
);

create table public.deck_cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scryfall_id text not null,
  card_name text not null,
  image_url text,
  is_basic_land boolean not null default false,
  quantity int not null check (quantity between 1 and 100),
  unique (deck_id, scryfall_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  result text not null check (result in ('win', 'loss')),
  played_at timestamptz not null default now()
);

create index on public.decks (user_id);
create index on public.deck_cards (deck_id);
create index on public.matches (deck_id);

-- RLS activado en todas las tablas
alter table public.decks enable row level security;
alter table public.deck_cards enable row level security;
alter table public.matches enable row level security;

-- Políticas: cada usuario solo ve y modifica lo suyo
create policy "decks_own" on public.decks
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "deck_cards_own" on public.deck_cards
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.decks d where d.id = deck_id and d.user_id = (select auth.uid()))
  );

create policy "matches_own" on public.matches
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.decks d where d.id = deck_id and d.user_id = (select auth.uid()))
  );