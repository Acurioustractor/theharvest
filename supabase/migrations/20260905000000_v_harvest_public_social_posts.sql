-- The Start page (client/src/lib/api.ts) reads this view. It has existed in the
-- production database since the Start page shipped, but was created by hand and
-- never recorded here, so a fresh environment built from the repo had no
-- relation to read. This is the production definition as of 2026-09-05,
-- captured with pg_get_viewdef, and is idempotent against production.

create or replace view public.v_harvest_public_social_posts as
select
  id,
  platform,
  account_name,
  post_type,
  message,
  permalink,
  published_at,
  media
from public.social_posts
where project_code = 'ACT-HV'
  and status = 'published'
  and published_at <= now();

grant select on public.v_harvest_public_social_posts to anon, authenticated, service_role;

-- Production also grants the read-only agent role. Guarded so the migration
-- applies in environments that do not have that role.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'agent_readonly') then
    grant select on public.v_harvest_public_social_posts to agent_readonly;
  end if;
end $$;
