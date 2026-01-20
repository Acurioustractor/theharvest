-- Harvest Events table for community event submissions (separate from network-wide events)
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

-- Harvest Businesses table for business directory submissions
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

-- Enable RLS
ALTER TABLE public.harvest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_businesses ENABLE ROW LEVEL SECURITY;

-- Harvest Events policies: Anyone can insert (submit), only admins can update/delete
CREATE POLICY "Anyone can submit harvest events"
  ON public.harvest_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved harvest events"
  ON public.harvest_events FOR SELECT
  USING (status = 'approved');

-- Harvest Businesses policies: Anyone can insert (submit), users can view approved
CREATE POLICY "Anyone can submit harvest businesses"
  ON public.harvest_businesses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved harvest businesses"
  ON public.harvest_businesses FOR SELECT
  USING (status = 'approved');

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_harvest_events_status ON public.harvest_events(status);
CREATE INDEX IF NOT EXISTS idx_harvest_events_date ON public.harvest_events(date);
CREATE INDEX IF NOT EXISTS idx_harvest_businesses_status ON public.harvest_businesses(status);
CREATE INDEX IF NOT EXISTS idx_harvest_businesses_category ON public.harvest_businesses(category);
