-- Enable required extension
create extension if not exists pgcrypto;

-- 1) Enum for event categories
DO $$ BEGIN
  CREATE TYPE public.event_category AS ENUM ('Tech', 'Music', 'Sports', 'General');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Helper function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DO $$ BEGIN
  CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger for profiles
DO $$ BEGIN
  CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4) Events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date_time timestamptz NOT NULL,
  image_url text,
  is_public boolean NOT NULL DEFAULT false,
  category public.event_category NOT NULL DEFAULT 'General',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  follower_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
DO $$ BEGIN
  CREATE POLICY "Anyone can view public events"
  ON public.events FOR SELECT USING (is_public = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own events"
  ON public.events FOR SELECT USING (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own events"
  ON public.events FOR INSERT WITH CHECK (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own events"
  ON public.events FOR UPDATE USING (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own events"
  ON public.events FOR DELETE USING (auth.uid() = creator_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Triggers for events
DO $$ BEGIN
  CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_public_datetime ON public.events (is_public, date_time);
CREATE INDEX IF NOT EXISTS idx_events_creator_datetime ON public.events (creator_id, date_time);

-- Realtime configuration
ALTER TABLE public.events REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
EXCEPTION WHEN undefined_object THEN NULL; WHEN duplicate_object THEN NULL; END $$;