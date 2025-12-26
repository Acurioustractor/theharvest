-- Core app tables for Supabase (frontend-only deployment)

create table if not exists app_users (
  id bigserial primary key,
  "openId" uuid not null unique,
  name text,
  email text,
  "loginMethod" text,
  role text not null default 'user' check (role in ('user', 'admin')),
  "createdAt" timestamp default now() not null,
  "updatedAt" timestamp default now() not null,
  "lastSignedIn" timestamp default now() not null
);

create table if not exists events (
  id bigserial primary key,
  title text not null,
  date timestamp not null,
  time text not null,
  location text not null,
  category text not null check (category in ('market', 'community', 'arts', 'workshop', 'music')),
  description text not null,
  "contactEmail" text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  "submittedBy" text,
  "createdAt" timestamp default now() not null,
  "updatedAt" timestamp default now() not null
);

create table if not exists businesses (
  id bigserial primary key,
  "userOpenId" uuid,
  name text not null,
  category text not null check (category in ('markets', 'arts', 'accommodation', 'services', 'food', 'wellness', 'retail', 'other')),
  description text not null,
  address text,
  phone text,
  email text,
  website text,
  facebook text,
  instagram text,
  "imageUrl" text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  "submittedBy" text,
  "submitterEmail" text not null,
  "createdAt" timestamp default now() not null,
  "updatedAt" timestamp default now() not null
);

alter table app_users enable row level security;
alter table events enable row level security;
alter table businesses enable row level security;

-- Ensure UUID column types if tables already existed with text
alter table if exists app_users
  alter column "openId" type uuid using "openId"::uuid;
alter table if exists businesses
  add column if not exists "userOpenId" uuid;
alter table if exists businesses
  alter column "userOpenId" type uuid using "userOpenId"::uuid;

-- app_users policies
create policy "app_users_select_own" on app_users
  for select
  using (auth.uid() = "openId"::uuid);

create policy "app_users_insert_own" on app_users
  for insert
  with check (auth.uid() = "openId"::uuid and role = 'user');

create policy "app_users_update_own" on app_users
  for update
  using (auth.uid() = "openId"::uuid)
  with check (auth.uid() = "openId"::uuid and role = 'user');

-- events policies (public read of approved, public submit pending)
create policy "events_select_approved" on events
  for select
  using (status = 'approved');

create policy "events_insert_pending" on events
  for insert
  with check (status = 'pending');

-- businesses policies (public read approved, public submit pending)
create policy "businesses_select_approved" on businesses
  for select
  using (status = 'approved');

create policy "businesses_select_own" on businesses
  for select
  using (auth.uid() = "userOpenId"::uuid);

create policy "businesses_insert_pending" on businesses
  for insert
  with check (status = 'pending' and "userOpenId" is null);
