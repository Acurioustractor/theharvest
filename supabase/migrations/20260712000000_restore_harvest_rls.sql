-- Public submissions are write-only. Approved records are served through the
-- application API, which returns explicit public DTOs without submitter PII.

ALTER TABLE public.harvest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit harvest events" ON public.harvest_events;
DROP POLICY IF EXISTS "Anyone can view approved harvest events" ON public.harvest_events;
DROP POLICY IF EXISTS "Allow anonymous insert harvest events" ON public.harvest_events;
DROP POLICY IF EXISTS "Allow public select approved harvest events" ON public.harvest_events;
DROP POLICY IF EXISTS "Allow service role full access to harvest events" ON public.harvest_events;

CREATE POLICY "Allow pending harvest event submissions"
  ON public.harvest_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Allow service role full access to harvest events"
  ON public.harvest_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit harvest businesses" ON public.harvest_businesses;
DROP POLICY IF EXISTS "Anyone can view approved harvest businesses" ON public.harvest_businesses;
DROP POLICY IF EXISTS "Allow anonymous insert harvest businesses" ON public.harvest_businesses;
DROP POLICY IF EXISTS "Allow public select approved harvest businesses" ON public.harvest_businesses;
DROP POLICY IF EXISTS "Allow service role full access to harvest businesses" ON public.harvest_businesses;

CREATE POLICY "Allow pending harvest business submissions"
  ON public.harvest_businesses FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND "userOpenId" IS NULL);

CREATE POLICY "Allow service role full access to harvest businesses"
  ON public.harvest_businesses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

REVOKE SELECT ON TABLE public.harvest_events FROM anon, authenticated;
REVOKE SELECT ON TABLE public.harvest_businesses FROM anon, authenticated;
GRANT INSERT ON TABLE public.harvest_events TO anon, authenticated;
GRANT INSERT ON TABLE public.harvest_businesses TO anon, authenticated;
