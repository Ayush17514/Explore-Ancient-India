
-- ==============================
-- Platform Overhaul Migration
-- ==============================

-- 1. Resource Tracker table
CREATE TABLE public.resource_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL,          -- 'manuscript', 'research', 'tribal', 'citation', 'site', 'school'
  mime_type TEXT,
  file_size_bytes BIGINT,
  file_url TEXT,
  source_table TEXT,                    -- originating table name
  source_id UUID,                       -- FK to the source record
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resource_tracker_type ON public.resource_tracker (resource_type);
CREATE INDEX idx_resource_tracker_source ON public.resource_tracker (source_table, source_id);
CREATE INDEX idx_resource_tracker_uploader ON public.resource_tracker (uploaded_by);

ALTER TABLE public.resource_tracker ENABLE ROW LEVEL SECURITY;

-- Public can read resources
CREATE POLICY "Public read resources" ON public.resource_tracker
  FOR SELECT USING (true);

-- Auth users can insert resources
CREATE POLICY "Auth users insert resources" ON public.resource_tracker
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

-- Admins can manage all resources
CREATE POLICY "Admins manage resources" ON public.resource_tracker
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 2. Add reviewed_by/reviewed_at to architecture_sites (was missing)
ALTER TABLE public.architecture_sites
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 3. Add reviewed_by/reviewed_at to philosophical_schools (was missing)
ALTER TABLE public.philosophical_schools
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 4. Add references JSONB and file_urls TEXT[] to content tables
ALTER TABLE public.manuscripts
  ADD COLUMN IF NOT EXISTS references_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

ALTER TABLE public.architecture_sites
  ADD COLUMN IF NOT EXISTS references_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

ALTER TABLE public.philosophical_schools
  ADD COLUMN IF NOT EXISTS references_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

ALTER TABLE public.tribal_records
  ADD COLUMN IF NOT EXISTS references_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

ALTER TABLE public.citations
  ADD COLUMN IF NOT EXISTS references_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

ALTER TABLE public.research_submissions
  ADD COLUMN IF NOT EXISTS references_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS file_urls TEXT[] DEFAULT '{}';

-- 5. Add additional metadata columns to content tables
ALTER TABLE public.manuscripts
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS script_type TEXT;

ALTER TABLE public.research_submissions
  ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS publication_year TEXT,
  ADD COLUMN IF NOT EXISTS journal TEXT;

ALTER TABLE public.tribal_records
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS recording_type TEXT;

ALTER TABLE public.citations
  ADD COLUMN IF NOT EXISTS abstract TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS page_numbers TEXT,
  ADD COLUMN IF NOT EXISTS volume TEXT,
  ADD COLUMN IF NOT EXISTS issue TEXT;

-- 6. Full-text search indexes for intelligent search
CREATE INDEX IF NOT EXISTS idx_manuscripts_search ON public.manuscripts USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_sites_search ON public.architecture_sites USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_schools_search ON public.philosophical_schools USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_tribal_search ON public.tribal_records USING gin(to_tsvector('english', coalesce(community_name, '') || ' ' || coalesce(description, '')));
CREATE INDEX IF NOT EXISTS idx_citations_search ON public.citations USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(authors, '')));
CREATE INDEX IF NOT EXISTS idx_research_search ON public.research_submissions USING gin(to_tsvector('english', coalesce(paper_title, '') || ' ' || coalesce(abstract, '')));
