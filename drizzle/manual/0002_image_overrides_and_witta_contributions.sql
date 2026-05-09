-- Manual migration applied via Supabase SQL Editor on prod
-- Source: matches the Drizzle schema additions from PR #2
-- Date applied: 2026-05-09 (record this in your DB ops notes)
--
-- Why manual: drizzle-kit generate trips over the historical
-- users → app_users rename (already handled by 0001_create_app_users.sql)
-- and prompts interactively. Running this SQL by hand bypasses the prompts.
--
-- Idempotent: safe to re-run. Uses IF NOT EXISTS / EXCEPTION handling.

DO $$ BEGIN
  CREATE TYPE "witta_contribution_status" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "witta_contributions" (
  "id" serial PRIMARY KEY,
  "author_name" varchar(255) NOT NULL,
  "author_email" varchar(320),
  "year_or_era" varchar(100) NOT NULL,
  "memory" text NOT NULL,
  "photo_url" varchar(1000),
  "status" "witta_contribution_status" DEFAULT 'pending' NOT NULL,
  "admin_notes" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "approved_at" timestamp with time zone,
  "approved_by" integer
);

CREATE TABLE IF NOT EXISTS "image_overrides" (
  "id" serial PRIMARY KEY,
  "page" varchar(100) NOT NULL,
  "slot" varchar(200) NOT NULL,
  "media_asset_id" varchar(64) NOT NULL,
  "src" varchar(1000) NOT NULL,
  "alt_text" varchar(500),
  "title" varchar(255),
  "set_by" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Widen editable_content.slot from varchar(100) to varchar(200)
-- (so longer slot identifiers like "milk-crate-pavilion-hero" fit)
ALTER TABLE "editable_content" ALTER COLUMN "slot" TYPE varchar(200);

-- Verify after running:
--   SELECT table_name, column_name, data_type
--   FROM information_schema.columns
--   WHERE table_name IN ('image_overrides', 'witta_contributions')
--   ORDER BY table_name, ordinal_position;
