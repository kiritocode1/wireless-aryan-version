-- =====================================================================
-- Track last-modified time on every content row.
-- Adds updated_at to all content tables and a BEFORE UPDATE trigger
-- that stamps now() whenever a row (including its photo_url / pdf_url)
-- changes. Existing rows are backfilled to created_at where available.
-- =====================================================================

-- ---------- 1. Shared trigger function ----------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- 2. Add column + trigger on every content table ----------
do $$
declare
  t text;
  has_created boolean;
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
    -- add column if missing
    execute format(
      'alter table %I add column if not exists updated_at timestamptz not null default now()',
      t
    );

    -- backfill nulls from created_at when that column exists; otherwise leave default now()
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'created_at'
    ) into has_created;

    if has_created then
      execute format(
        'update %I set updated_at = coalesce(updated_at, created_at) where updated_at is null',
        t
      );
    end if;

    -- (re)attach trigger — fires on INSERT and UPDATE so every admin write
    -- (file upload, edit, upsert, raw SQL) gets a fresh updated_at.
    execute format('drop trigger if exists trg_set_updated_at on %I', t);
    execute format(
      'create trigger trg_set_updated_at before insert or update on %I
         for each row execute function set_updated_at()',
      t
    );
  end loop;
end $$;

-- ---------- 3. Index updated_at where it's useful for "latest changes" feeds ----------
create index if not exists idx_home_slider_updated       on home_slider       (updated_at desc);
create index if not exists idx_former_directors_updated  on former_directors  (updated_at desc);
create index if not exists idx_office_sections_updated   on office_sections   (updated_at desc);
create index if not exists idx_press_releases_updated    on press_releases    (updated_at desc);
create index if not exists idx_bulletins_updated         on bulletins         (updated_at desc);
create index if not exists idx_tenders_updated           on tenders           (updated_at desc);
create index if not exists idx_recruitments_updated      on recruitments      (updated_at desc);
create index if not exists idx_rti_documents_updated     on rti_documents     (updated_at desc);
create index if not exists idx_gazettes_updated          on gazettes          (updated_at desc);
create index if not exists idx_promotion_orders_updated  on promotion_orders  (updated_at desc);
create index if not exists idx_transfer_orders_updated   on transfer_orders   (updated_at desc);
create index if not exists idx_gradation_lists_updated   on gradation_lists   (updated_at desc);
create index if not exists idx_faculty_updated           on faculty           (updated_at desc);
create index if not exists idx_welfare_activities_updated on welfare_activities (updated_at desc);
create index if not exists idx_photo_gallery_updated     on photo_gallery     (updated_at desc);
create index if not exists idx_training_calendars_updated on training_calendars (updated_at desc);
create index if not exists idx_training_schedules_updated on training_schedules (updated_at desc);
