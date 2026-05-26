-- ─────────────────────────────────────────────────────────────────────
-- Osztály · 12.i Projektmenedzsment tudásbázis
-- Supabase schema · v1.0
-- ─────────────────────────────────────────────────────────────────────
-- Futtatás: Supabase > SQL Editor > New query > ide illeszd be > Run
-- ─────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── CATEGORIES ───────────────────────────────────────────────────────
create table if not exists public.categories (
  slug        text primary key,                -- e.g. 'research', 'design'
  label       text        not null,
  description text,
  -- ui hints used by the front-end
  chip_bg     text,                            -- e.g. '#EFE7FF'
  chip_fg     text,                            -- e.g. '#3F1FA8'
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

insert into public.categories (slug, label, description, chip_bg, chip_fg, sort_order)
values
  ('research',     'Kutatás',       'Források, interjúk, irodalomkutatás',    '#EFE7FF', '#3F1FA8', 10),
  ('design',       'Design',        'Vázlatok, rendszerek, prototípusok',      '#FFE4DC', '#B33A1D', 20),
  ('coding',       'Kódolás',       'Repók, kódrészletek, hibakeresési jegyz.','#E7F2DC', '#3F5C12', 30),
  ('presentation', 'Prezentáció',   'Diasorok, scriptek, demo tervek',         '#DCE9FB', '#1B4B8F', 40),
  ('fieldwork',    'Terepgyakorlat','Helyszíni munkák, kísérletek, naplók',    '#FFEEBB', '#6B4A00', 50),
  ('writing',      'Írás',          'Riportok, esszék, vázlatok',              '#F6E3F0', '#7B1F61', 60)
on conflict (slug) do nothing;


-- ── TEAMS ────────────────────────────────────────────────────────────
create table if not exists public.teams (
  id         text primary key,                 -- short slug, e.g. 't01'
  name       text        not null unique,
  emoji      text        not null default '✦',
  color      text        not null default '#6B3FE6',
  focus      text,                              -- one-line description of the team's project
  members    int         not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists teams_name_idx on public.teams (name);


-- ── POSTS ────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  excerpt     text,
  content     text        not null default '',  -- markdown body
  team_id     text        not null references public.teams(id)      on delete cascade,
  category    text        not null references public.categories(slug) on delete restrict,
  tags        text[]      not null default '{}',
  image_url   text,
  pinned      boolean     not null default false,
  read_min    int         not null default 3,
  author      text,                              -- optional student handle
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_team_idx     on public.posts (team_id);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_created_idx  on public.posts (created_at desc);
create index if not exists posts_tags_gin     on public.posts using gin (tags);

-- Keep `updated_at` honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists posts_touch_updated on public.posts;
create trigger posts_touch_updated
  before update on public.posts
  for each row execute function public.touch_updated_at();


-- ── ROW-LEVEL SECURITY ──────────────────────────────────────────────
-- Permissive defaults appropriate for a classroom prototype. Tighten
-- before exposing this publicly: e.g. require `auth.uid()` matches a
-- `team_members` join table for inserts/updates/deletes on posts.
alter table public.teams      enable row level security;
alter table public.posts      enable row level security;
alter table public.categories enable row level security;

create policy "teams readable by anyone"      on public.teams      for select using (true);
create policy "categories readable by anyone" on public.categories for select using (true);
create policy "posts readable by anyone"      on public.posts      for select using (true);

-- For the prototype anyone signed in may insert/update/delete their team's posts.
-- Replace `true` below with a membership check once auth is wired up.
create policy "posts writable while in beta"  on public.posts
  for insert with check (true);
create policy "posts updatable while in beta" on public.posts
  for update using (true) with check (true);
create policy "posts deletable while in beta" on public.posts
  for delete using (true);


-- ── STORAGE: képfeltöltés bucket ────────────────────────────────────
-- Supabase > SQL Editor > futtasd ezt
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,   -- 5 MB limit
  array['image/jpeg','image/png','image/gif','image/webp']
)
on conflict (id) do update set public = true;

-- Feltöltés engedélye (mindenki)
create policy "post_images_insert" on storage.objects
  for insert with check (bucket_id = 'post-images');

-- Törlés engedélye (mindenki)
create policy "post_images_delete" on storage.objects
  for delete using (bucket_id = 'post-images');


-- ── MIGRATION: bejegyzés jelszó mező ────────────────────────────────
-- Ha a posts tábla már létezik, futtasd ezt külön:
alter table public.posts add column if not exists password text;


-- ── MIGRATION: forrás mezők ──────────────────────────────────────────
-- Egy bejegyzéshez opcionálisan hozzárendelhető külső forrás (link + OG meta)
alter table public.posts add column if not exists source_url         text;
alter table public.posts add column if not exists source_title       text;
alter table public.posts add column if not exists source_description text;
alter table public.posts add column if not exists source_og_image    text;


-- ── POST COMMENTS ────────────────────────────────────────────────────
create table if not exists public.post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author     text not null default 'Névtelen',
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.post_comments (post_id, created_at);

alter table public.post_comments enable row level security;

create policy "comments readable by anyone"     on public.post_comments for select using (true);
create policy "comments writable while in beta" on public.post_comments for insert with check (true);


-- ── HELPFUL VIEWS ───────────────────────────────────────────────────
create or replace view public.posts_with_team as
  select
    p.*,
    t.name  as team_name,
    t.color as team_color,
    t.emoji as team_emoji,
    t.focus as team_focus
  from public.posts p
  join public.teams t on t.id = p.team_id;

create or replace view public.category_counts as
  select c.slug, c.label, count(p.id)::int as post_count
  from public.categories c
  left join public.posts p on p.category = c.slug
  group by c.slug, c.label
  order by c.sort_order;


-- ── SEED TEAMS — 12.i osztály 9 témakörcsapata (matches src/data.jsx) ──
insert into public.teams (id, name, emoji, color, focus, members) values
  ('t01', 'Design',               '◈', '#6B3FE6', 'Szerkezet, design meghatározása',                      3),
  ('t02', 'Mi a projekt?',        '◉', '#F26A4B', 'A projekt definíciója és tervezése',                  3),
  ('t03', 'A projekt keretei',    '◇', '#1B4B8F', 'Határidő és költségkeret',                             3),
  ('t04', 'Projektcélok',         '◎', '#7B1F61', 'Idő, költség, minőség háromszöge',                    3),
  ('t05', 'Menedzsment',          '◆', '#3F5C12', 'A menedzsment négy fő feladata',                      3),
  ('t06', 'Menedzser szerepkörei','○', '#B36A00', 'Interperszonális, információs, döntési szerepkör',    3),
  ('t07', 'Projektmenedzsment',   '◐', '#0E5C5F', 'A projektmenedzsment folyamata és szereplői',         3),
  ('t08', 'Segítő szoftverek',    '▣', '#8A4A1F', 'GIMP és Trello a projektmunkában',                    3),
  ('t09', 'Teszt',                '✓', '#1A6B3A', '20 ellenőrző kérdés a témákhoz',                      3)
on conflict (id) do nothing;
