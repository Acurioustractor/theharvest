-- Disable RLS on harvest tables - these are public form submissions
-- Data is non-sensitive and all submissions require admin review anyway
ALTER TABLE public.harvest_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_businesses DISABLE ROW LEVEL SECURITY;
