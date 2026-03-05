
-- ==============================
-- Translations table (EAV pattern)
-- ==============================
CREATE TABLE public.translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,       -- 'manuscript', 'architecture_site', 'philosophical_school', 'tribal_record', 'citation'
  entity_id uuid NOT NULL,
  field_name text NOT NULL,        -- 'title', 'description', 'name', etc.
  language_code text NOT NULL,     -- 'en', 'hi', 'sa', 'ta', 'bn', 'mr', 'gu'
  translated_text text NOT NULL,
  is_machine_translated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, field_name, language_code)
);

CREATE INDEX idx_translations_entity ON public.translations (entity_type, entity_id);
CREATE INDEX idx_translations_lang ON public.translations (language_code);

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Anyone can read translations
CREATE POLICY "Public read translations"
  ON public.translations FOR SELECT
  USING (true);

-- Admins and moderators can manage translations
CREATE POLICY "Admins manage translations"
  ON public.translations FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Trigger for updated_at
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==============================
-- API Keys table
-- ==============================
CREATE TABLE public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  key_hash text NOT NULL,          -- SHA-256 hash of the actual key
  key_prefix text NOT NULL,        -- First 8 chars for identification (e.g. "bik_a1b2...")
  name text NOT NULL DEFAULT 'Default',
  is_active boolean NOT NULL DEFAULT true,
  rate_limit_per_minute integer NOT NULL DEFAULT 60,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX idx_api_keys_hash ON public.api_keys (key_hash);
CREATE INDEX idx_api_keys_user ON public.api_keys (user_id);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users can view their own keys
CREATE POLICY "Users read own api keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own keys
CREATE POLICY "Users create own api keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own keys (deactivate etc.)
CREATE POLICY "Users update own api keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own keys
CREATE POLICY "Users delete own api keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can manage all keys
CREATE POLICY "Admins manage api keys"
  ON public.api_keys FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ==============================
-- Supported languages reference table
-- ==============================
CREATE TABLE public.supported_languages (
  code text PRIMARY KEY,
  name text NOT NULL,
  native_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.supported_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read supported languages"
  ON public.supported_languages FOR SELECT
  USING (true);

CREATE POLICY "Admins manage supported languages"
  ON public.supported_languages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Seed supported languages
INSERT INTO public.supported_languages (code, name, native_name) VALUES
  ('en', 'English', 'English'),
  ('hi', 'Hindi', 'हिन्दी'),
  ('sa', 'Sanskrit', 'संस्कृतम्'),
  ('ta', 'Tamil', 'தமிழ்'),
  ('bn', 'Bengali', 'বাংলা'),
  ('mr', 'Marathi', 'मराठी'),
  ('gu', 'Gujarati', 'ગુજરાતી');
