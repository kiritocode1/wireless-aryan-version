-- =====================================================================
-- Wireless Police Dept — initial schema
-- Bilingual content: *_en / *_mr columns
-- Auth model: profiles.is_admin gates all writes; reads are public
-- File uploads: 'photos' and 'pdfs' storage buckets
-- =====================================================================

-- ---------- 1. AUTH / PROFILES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- 2. SITE SETTINGS (KV) ----------
create table if not exists site_settings (
  key text primary key,
  value_text text,
  value_url text,
  updated_at timestamptz not null default now()
);

insert into site_settings (key, value_url) values
  ('hierarchy_image_url', null),
  ('ranks_master_pdf_url', null)
on conflict (key) do nothing;

-- ---------- 3. HOME SLIDER ----------
create table if not exists home_slider (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null,
  title_en text,
  title_mr text,
  subtitle_en text,
  subtitle_mr text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- 4. DIRECTOR'S DESK (singleton) ----------
create table if not exists director_current (
  id int primary key default 1 check (id = 1),
  name_en text not null,
  name_mr text not null,
  designation_en text,
  designation_mr text,
  message_en text,
  message_mr text,
  photo_url text,
  updated_at timestamptz not null default now()
);

-- ---------- 5. FORMER DIRECTORS ----------
create table if not exists former_directors (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_mr text not null,
  designation_en text,
  designation_mr text,
  tenure text,
  photo_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 6. OFFICE SECTIONS (Option A) ----------
create table if not exists office_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_mr text not null,
  incharge_en text,
  incharge_mr text,
  description_en text,
  description_mr text,
  photo_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 7. RANKS ----------
create table if not exists ranks (
  id uuid primary key default gen_random_uuid(),
  rank_en text not null,
  rank_mr text not null,
  description_en text,
  description_mr text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 8. PRESS RELEASES (also feeds "Latest News" on home) ----------
create table if not exists press_releases (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  description_en text,
  description_mr text,
  photo_url text,
  pdf_url text,
  published_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- 9. BULLETINS (home page) ----------
create table if not exists bulletins (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- 10. TENDERS ----------
create table if not exists tenders (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  last_date date,
  file_size_kb int,
  created_at timestamptz not null default now()
);

-- ---------- 11. RECRUITMENTS ----------
create table if not exists recruitments (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  last_date date,
  file_size_kb int,
  created_at timestamptz not null default now()
);

-- ---------- 12. RTI DOCUMENTS ----------
create table if not exists rti_documents (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  file_size_kb int,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 13. GAZETTES ----------
create table if not exists gazettes (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  file_size_kb int,
  created_at timestamptz not null default now()
);

-- ---------- 14. PROMOTION ORDERS ----------
create table if not exists promotion_orders (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- 15. TRANSFER ORDERS ----------
create table if not exists transfer_orders (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- 16. GRADATION LISTS ----------
create table if not exists gradation_lists (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  pdf_url text,
  published_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- 17. OFFICERS (List of Officers and Employees) ----------
create table if not exists officers (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_mr text not null,
  designation_en text,
  designation_mr text,
  email text,
  contact text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 18. FACULTY ----------
create table if not exists faculty (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_mr text not null,
  designation_en text,
  designation_mr text,
  email text,
  contact text,
  photo_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 19. WELFARE ACTIVITIES ----------
create table if not exists welfare_activities (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  photo_url text,
  activity_date date,
  created_at timestamptz not null default now()
);

-- ---------- 20. PHOTO GALLERY ----------
create table if not exists photo_gallery (
  id uuid primary key default gen_random_uuid(),
  title_en text,
  title_mr text,
  photo_url text not null,
  taken_date date,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 21. TRAINING CALENDARS (year + PDF) ----------
create table if not exists training_calendars (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  pdf_url text,
  created_at timestamptz not null default now()
);

-- ---------- 22. TRAINING SCHEDULES (course details) ----------
create table if not exists training_schedules (
  id uuid primary key default gen_random_uuid(),
  course_name_en text not null,
  course_name_mr text not null,
  duration_en text,
  duration_mr text,
  date_from date,
  date_to date,
  eligibility_en text,
  eligibility_mr text,
  coordinator_en text,
  coordinator_mr text,
  pdf_url text,
  created_at timestamptz not null default now()
);

-- ---------- 23. IMPACT STATS (home OurImpact section) ----------
create table if not exists impact_stats (
  id uuid primary key default gen_random_uuid(),
  label_en text not null,
  label_mr text not null,
  value text not null,
  suffix text default '',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY: public read, admin write on all content tables
-- =====================================================================
do $$
declare
  t text;
  content_tables text[] := array[
    'site_settings','home_slider','director_current','former_directors',
    'office_sections','ranks','press_releases','bulletins','tenders',
    'recruitments','rti_documents','gazettes','promotion_orders',
    'transfer_orders','gradation_lists','officers','faculty',
    'welfare_activities','photo_gallery','training_calendars',
    'training_schedules','impact_stats'
  ];
begin
  foreach t in array content_tables loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public_read" on %I', t);
    execute format('create policy "public_read" on %I for select using (true)', t);
    execute format('drop policy if exists "admin_write" on %I', t);
    execute format('create policy "admin_write" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- profiles: users can read their own; admins can read all; only admin can flip is_admin
alter table profiles enable row level security;
drop policy if exists "self_read" on profiles;
create policy "self_read" on profiles for select using (auth.uid() = id or is_admin());
drop policy if exists "self_update_basic" on profiles;
create policy "self_update_basic" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id and is_admin = (select is_admin from profiles where id = auth.uid()));
drop policy if exists "admin_full" on profiles;
create policy "admin_full" on profiles for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- INDEXES for common queries
-- =====================================================================
create index if not exists idx_press_releases_date on press_releases (published_date desc);
create index if not exists idx_bulletins_date on bulletins (published_date desc);
create index if not exists idx_tenders_date on tenders (published_date desc);
create index if not exists idx_recruitments_date on recruitments (published_date desc);
create index if not exists idx_gazettes_date on gazettes (published_date desc);
create index if not exists idx_promotion_orders_date on promotion_orders (published_date desc);
create index if not exists idx_transfer_orders_date on transfer_orders (published_date desc);
create index if not exists idx_gradation_lists_date on gradation_lists (published_date desc);
create index if not exists idx_home_slider_order on home_slider (display_order) where is_active;
