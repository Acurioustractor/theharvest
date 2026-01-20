-- Drop existing policies and recreate with proper permissions
DROP POLICY IF EXISTS "Anyone can submit harvest events" ON public.harvest_events;
DROP POLICY IF EXISTS "Anyone can view approved harvest events" ON public.harvest_events;
DROP POLICY IF EXISTS "Anyone can submit harvest businesses" ON public.harvest_businesses;
DROP POLICY IF EXISTS "Anyone can view approved harvest businesses" ON public.harvest_businesses;

-- Allow anonymous users to insert (submit) events
CREATE POLICY "Allow anonymous insert harvest events"
  ON public.harvest_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view approved events
CREATE POLICY "Allow public select approved harvest events"
  ON public.harvest_events FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Allow service role full access for admin functions
CREATE POLICY "Allow service role full access to harvest events"
  ON public.harvest_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert (submit) businesses
CREATE POLICY "Allow anonymous insert harvest businesses"
  ON public.harvest_businesses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view approved businesses
CREATE POLICY "Allow public select approved harvest businesses"
  ON public.harvest_businesses FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Allow service role full access for admin functions
CREATE POLICY "Allow service role full access to harvest businesses"
  ON public.harvest_businesses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
