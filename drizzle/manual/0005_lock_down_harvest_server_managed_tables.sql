-- Lock down Harvest tables that are managed through the server/tRPC layer.
-- Safe to run more than once.
--
-- Access model:
-- - Browser Supabase anon/auth clients must not read or write these tables directly.
-- - Public reads/writes continue through server routes.
-- - Admin writes continue through protected server routes.
-- - Service-role REST fallbacks continue to work.

REVOKE ALL ON TABLE
  public.editable_content,
  public.image_overrides,
  public.member_wall_entries,
  public.witta_contributions
FROM anon, authenticated;

GRANT ALL PRIVILEGES ON TABLE
  public.editable_content,
  public.image_overrides,
  public.member_wall_entries,
  public.witta_contributions
TO service_role;

DO $$
DECLARE
  seq regclass;
BEGIN
  FOR seq IN
    SELECT pg_get_serial_sequence('public.editable_content', 'id')::regclass
    UNION ALL
    SELECT pg_get_serial_sequence('public.image_overrides', 'id')::regclass
    UNION ALL
    SELECT pg_get_serial_sequence('public.member_wall_entries', 'id')::regclass
    UNION ALL
    SELECT pg_get_serial_sequence('public.witta_contributions', 'id')::regclass
  LOOP
    IF seq IS NOT NULL THEN
      EXECUTE format('REVOKE ALL ON SEQUENCE %s FROM anon, authenticated', seq);
      EXECUTE format('GRANT ALL PRIVILEGES ON SEQUENCE %s TO service_role', seq);
    END IF;
  END LOOP;
END $$;

ALTER TABLE public.editable_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_wall_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.witta_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages editable_content" ON public.editable_content;
CREATE POLICY "Service role manages editable_content"
  ON public.editable_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages image_overrides" ON public.image_overrides;
CREATE POLICY "Service role manages image_overrides"
  ON public.image_overrides
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages member_wall_entries" ON public.member_wall_entries;
CREATE POLICY "Service role manages member_wall_entries"
  ON public.member_wall_entries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages witta_contributions" ON public.witta_contributions;
CREATE POLICY "Service role manages witta_contributions"
  ON public.witta_contributions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verification:
--   select c.relname, c.relrowsecurity
--   from pg_class c join pg_namespace n on n.oid = c.relnamespace
--   where n.nspname = 'public'
--     and c.relname in ('editable_content','image_overrides','member_wall_entries','witta_contributions');
--
--   select tablename, policyname, roles, cmd
--   from pg_policies
--   where schemaname = 'public'
--     and tablename in ('editable_content','image_overrides','member_wall_entries','witta_contributions');
--
--   select table_name, grantee, privilege_type
--   from information_schema.table_privileges
--   where table_schema = 'public'
--     and table_name in ('editable_content','image_overrides','member_wall_entries','witta_contributions')
--     and grantee in ('anon','authenticated','service_role');
