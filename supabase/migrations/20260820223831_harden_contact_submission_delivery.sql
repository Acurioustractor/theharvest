-- Public enquiries must be recorded before any GHL call. This table is private:
-- Edge Functions use the service role; browser clients have no direct access.
CREATE TABLE IF NOT EXISTS public.community_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ghl_contact_id TEXT,
  ghl_synced BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_submissions
  ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'stored',
  ADD COLUMN IF NOT EXISTS delivery_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_delivery_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_delivery_error TEXT,
  ADD COLUMN IF NOT EXISTS ghl_conversation_id TEXT,
  ADD COLUMN IF NOT EXISTS ghl_opportunity_id TEXT,
  ADD COLUMN IF NOT EXISTS workflow_triggered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

ALTER TABLE public.community_submissions
  DROP CONSTRAINT IF EXISTS community_submissions_delivery_status_check;

ALTER TABLE public.community_submissions
  ADD CONSTRAINT community_submissions_delivery_status_check
  CHECK (delivery_status IN ('stored', 'delivering', 'retry', 'delivered', 'failed'));

CREATE INDEX IF NOT EXISTS community_submissions_delivery_queue_idx
  ON public.community_submissions (delivery_status, created_at)
  WHERE delivery_status IN ('stored', 'retry', 'failed');

ALTER TABLE public.community_submissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.community_submissions FROM anon, authenticated;
GRANT ALL ON TABLE public.community_submissions TO service_role;
