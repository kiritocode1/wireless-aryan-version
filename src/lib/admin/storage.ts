import { supabase } from "@/lib/supabase";

export type Bucket = "photos" | "pdfs";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function uploadFile(bucket: Bucket, file: File): Promise<string> {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const base = slugify(file.name.replace(/\.[^.]+$/, ""));
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}${ext ? "." + ext : ""}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function pathFromPublicUrl(url: string, bucket: Bucket): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  return url.slice(idx + marker.length);
}

export async function deleteFile(bucket: Bucket, url: string): Promise<void> {
  const path = pathFromPublicUrl(url, bucket);
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}
