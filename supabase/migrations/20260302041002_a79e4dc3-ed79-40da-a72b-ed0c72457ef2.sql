
-- 1. Roles enum & user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'scholar', 'institution', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  institution TEXT,
  bio TEXT,
  avatar_url TEXT,
  role_label TEXT DEFAULT 'Contributor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Languages table
CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  script TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- 4. Dynasties table
CREATE TABLE public.dynasties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  period TEXT,
  region TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dynasties ENABLE ROW LEVEL SECURITY;

-- 5. Authors table
CREATE TABLE public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  era TEXT,
  language_id UUID REFERENCES public.languages(id),
  biography TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- 6. Manuscripts table
CREATE TABLE public.manuscripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  language_id UUID REFERENCES public.languages(id),
  author_id UUID REFERENCES public.authors(id),
  dynasty_id UUID REFERENCES public.dynasties(id),
  estimated_period TEXT,
  repository_source TEXT,
  file_url TEXT,
  domain TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_manuscripts_domain ON public.manuscripts(domain);
CREATE INDEX idx_manuscripts_status ON public.manuscripts(status);

-- 7. Architecture sites table
CREATE TABLE public.architecture_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  region TEXT,
  era TEXT,
  dynasty_id UUID REFERENCES public.dynasties(id),
  description TEXT,
  architectural_style TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.architecture_sites ENABLE ROW LEVEL SECURITY;

-- 8. Philosophical schools table
CREATE TABLE public.philosophical_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tradition TEXT,
  founder TEXT,
  period TEXT,
  core_texts TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.philosophical_schools ENABLE ROW LEVEL SECURITY;

-- 9. Tribal records table
CREATE TABLE public.tribal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_name TEXT NOT NULL,
  region TEXT,
  knowledge_type TEXT,
  documenter_name TEXT,
  description TEXT,
  media_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tribal_records ENABLE ROW LEVEL SECURITY;

-- 10. Citations table
CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT,
  source TEXT,
  year TEXT,
  doi TEXT,
  url TEXT,
  citation_type TEXT DEFAULT 'article',
  domain TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

-- 11. Research submissions table
CREATE TABLE public.research_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_title TEXT NOT NULL,
  authors TEXT,
  affiliation TEXT,
  domain TEXT,
  abstract TEXT,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.research_submissions ENABLE ROW LEVEL SECURITY;

-- 12. Datasets table
CREATE TABLE public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  domain TEXT,
  format TEXT,
  size_bytes BIGINT,
  downloads INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

-- 13. Activity log for admin analytics
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- ========== SECURITY DEFINER FUNCTION ==========
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ========== RLS POLICIES ==========

-- user_roles: users read own, admins read all
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Public profiles are viewable" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- languages, dynasties, authors, datasets: public read
CREATE POLICY "Public read languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Admin manage languages" ON public.languages FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read dynasties" ON public.dynasties FOR SELECT USING (true);
CREATE POLICY "Admin manage dynasties" ON public.dynasties FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read authors" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admin manage authors" ON public.authors FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read datasets" ON public.datasets FOR SELECT USING (is_public = true);
CREATE POLICY "Admin manage datasets" ON public.datasets FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Content tables: public read approved, users insert own, admins/mods manage all
-- manuscripts
CREATE POLICY "Public read approved manuscripts" ON public.manuscripts
  FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Auth users submit manuscripts" ON public.manuscripts
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage manuscripts" ON public.manuscripts
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') OR auth.uid() = submitted_by);
CREATE POLICY "Admins delete manuscripts" ON public.manuscripts
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- architecture_sites
CREATE POLICY "Public read approved sites" ON public.architecture_sites
  FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Auth users submit sites" ON public.architecture_sites
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage sites" ON public.architecture_sites
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Admins delete sites" ON public.architecture_sites
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- philosophical_schools
CREATE POLICY "Public read approved schools" ON public.philosophical_schools
  FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Auth users submit schools" ON public.philosophical_schools
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage schools" ON public.philosophical_schools
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Admins delete schools" ON public.philosophical_schools
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- tribal_records
CREATE POLICY "Public read approved tribal" ON public.tribal_records
  FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Auth users submit tribal" ON public.tribal_records
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage tribal" ON public.tribal_records
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Admins delete tribal" ON public.tribal_records
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- citations
CREATE POLICY "Public read approved citations" ON public.citations
  FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Auth users submit citations" ON public.citations
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage citations" ON public.citations
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Admins delete citations" ON public.citations
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- research_submissions
CREATE POLICY "Public read approved research" ON public.research_submissions
  FOR SELECT USING (status = 'approved' OR auth.uid() = submitted_by OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Auth users submit research" ON public.research_submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins manage research" ON public.research_submissions
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Admins delete research" ON public.research_submissions
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- activity_log: only admins
CREATE POLICY "Admins read activity" ON public.activity_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System insert activity" ON public.activity_log
  FOR INSERT WITH CHECK (true);

-- ========== TRIGGERS ==========

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.manuscripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.architecture_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.philosophical_schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tribal_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.research_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
