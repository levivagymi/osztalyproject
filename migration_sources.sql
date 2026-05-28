-- ─────────────────────────────────────────────────────────────────────
-- Migráció: sources JSONB tömb hozzáadása a posts táblához
-- Futtatás: Supabase > SQL Editor > New query > Run
-- ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS sources JSONB NOT NULL DEFAULT '[]'::jsonb;
