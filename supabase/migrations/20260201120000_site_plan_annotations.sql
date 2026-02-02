CREATE TABLE IF NOT EXISTS public.site_plan_annotations (
  id SERIAL PRIMARY KEY,
  point_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('note', 'photo')),
  content TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_plan_annotations_point ON site_plan_annotations(point_id);
