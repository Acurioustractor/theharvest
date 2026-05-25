-- Public form tables required by the Harvest website.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.harvest_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('market', 'community', 'arts', 'workshop', 'music')),
  description TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "submittedBy" TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.harvest_businesses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('markets', 'arts', 'accommodation', 'services', 'food', 'wellness', 'retail', 'other')),
  description TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  "imageUrl" TEXT,
  "submittedBy" TEXT,
  "submitterEmail" TEXT NOT NULL,
  "userOpenId" TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_feedback (
  id SERIAL PRIMARY KEY,
  event_id INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 4),
  best_part TEXT,
  would_return TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.harvest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit harvest events" ON public.harvest_events;
CREATE POLICY "Anyone can submit harvest events"
  ON public.harvest_events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view approved harvest events" ON public.harvest_events;
CREATE POLICY "Anyone can view approved harvest events"
  ON public.harvest_events FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Service role manages harvest events" ON public.harvest_events;
CREATE POLICY "Service role manages harvest events"
  ON public.harvest_events FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anyone can submit harvest businesses" ON public.harvest_businesses;
CREATE POLICY "Anyone can submit harvest businesses"
  ON public.harvest_businesses FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view approved harvest businesses" ON public.harvest_businesses;
CREATE POLICY "Anyone can view approved harvest businesses"
  ON public.harvest_businesses FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Service role manages harvest businesses" ON public.harvest_businesses;
CREATE POLICY "Service role manages harvest businesses"
  ON public.harvest_businesses FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anyone can submit event feedback" ON public.event_feedback;
CREATE POLICY "Anyone can submit event feedback"
  ON public.event_feedback FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages event feedback" ON public.event_feedback;
CREATE POLICY "Service role manages event feedback"
  ON public.event_feedback FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_harvest_events_status ON public.harvest_events(status);
CREATE INDEX IF NOT EXISTS idx_harvest_events_date ON public.harvest_events(date);
CREATE INDEX IF NOT EXISTS idx_harvest_businesses_status ON public.harvest_businesses(status);
CREATE INDEX IF NOT EXISTS idx_harvest_businesses_category ON public.harvest_businesses(category);
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON public.event_feedback(event_id);
