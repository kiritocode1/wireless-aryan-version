-- =====================================================================
-- Storage buckets: 'photos' and 'pdfs'
-- Both are public-read; only admins can upload/update/delete.
-- =====================================================================

insert into storage.buckets (id, name, public)
values
  ('photos', 'photos', true),
  ('pdfs',   'pdfs',   true)
on conflict (id) do nothing;

-- ---------- photos ----------
drop policy if exists "photos_public_read"  on storage.objects;
drop policy if exists "photos_admin_insert" on storage.objects;
drop policy if exists "photos_admin_update" on storage.objects;
drop policy if exists "photos_admin_delete" on storage.objects;

create policy "photos_public_read" on storage.objects
  for select using (bucket_id = 'photos');

create policy "photos_admin_insert" on storage.objects
  for insert with check (bucket_id = 'photos' and is_admin());

create policy "photos_admin_update" on storage.objects
  for update using (bucket_id = 'photos' and is_admin());

create policy "photos_admin_delete" on storage.objects
  for delete using (bucket_id = 'photos' and is_admin());

-- ---------- pdfs ----------
drop policy if exists "pdfs_public_read"  on storage.objects;
drop policy if exists "pdfs_admin_insert" on storage.objects;
drop policy if exists "pdfs_admin_update" on storage.objects;
drop policy if exists "pdfs_admin_delete" on storage.objects;

create policy "pdfs_public_read" on storage.objects
  for select using (bucket_id = 'pdfs');

create policy "pdfs_admin_insert" on storage.objects
  for insert with check (bucket_id = 'pdfs' and is_admin());

create policy "pdfs_admin_update" on storage.objects
  for update using (bucket_id = 'pdfs' and is_admin());

create policy "pdfs_admin_delete" on storage.objects
  for delete using (bucket_id = 'pdfs' and is_admin());
