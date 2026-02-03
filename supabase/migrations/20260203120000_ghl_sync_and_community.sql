-- GHL sync tables (referenced by ghl-webhook edge function)
CREATE TABLE IF NOT EXISTS public.ghl_contacts (
  id TEXT PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  tags TEXT[],
  source TEXT,
  location_id TEXT,
  raw_data JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ghl_opportunities (
  id TEXT PRIMARY KEY,
  contact_id TEXT REFERENCES public.ghl_contacts(id) ON DELETE SET NULL,
  pipeline_id TEXT,
  stage_id TEXT,
  stage_name TEXT,
  status TEXT,
  monetary_value NUMERIC,
  name TEXT,
  raw_data JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ghl_sync_log (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  error_message TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community engagement tables

-- Ideas bucket: anyone can submit an idea
CREATE TABLE IF NOT EXISTS public.community_ideas (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  idea_type TEXT NOT NULL CHECK (idea_type IN ('general', 'event', 'workshop', 'enterprise', 'collaboration', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in-progress', 'done', 'parked')),
  admin_notes TEXT,
  ghl_contact_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Residency applications: artists, enterprises, workshop leaders
CREATE TABLE IF NOT EXISTS public.residency_applications (
  id SERIAL PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  residency_type TEXT NOT NULL CHECK (residency_type IN ('artist', 'enterprise', 'workshop-leader', 'storyteller', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  portfolio_url TEXT,
  duration_weeks INTEGER,
  preferred_dates TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interview', 'accepted', 'waitlisted', 'declined')),
  admin_notes TEXT,
  ghl_contact_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business info session signups
CREATE TABLE IF NOT EXISTS public.business_interest (
  id SERIAL PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_type TEXT NOT NULL CHECK (interest_type IN ('info-session', 'expression-of-interest', 'partnership', 'stall-booking', 'other')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'attending', 'completed')),
  ghl_contact_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ghl_contacts_email ON public.ghl_contacts(email);
CREATE INDEX IF NOT EXISTS idx_ghl_sync_log_created ON public.ghl_sync_log(created_at);
CREATE INDEX IF NOT EXISTS idx_community_ideas_status ON public.community_ideas(status);
CREATE INDEX IF NOT EXISTS idx_residency_applications_status ON public.residency_applications(status);
CREATE INDEX IF NOT EXISTS idx_business_interest_status ON public.business_interest(status);

-- RLS
ALTER TABLE public.ghl_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residency_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_interest ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone can submit)
CREATE POLICY "Anyone can submit ideas" ON public.community_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can apply for residency" ON public.residency_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can express business interest" ON public.business_interest FOR INSERT WITH CHECK (true);

-- GHL tables: only service role (edge functions) can read/write
-- No public policies needed — edge functions use service role key
