import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import FileUploadField from "@/components/admin/FileUploadField";
import { Bucket } from "@/lib/admin/storage";
import { toast } from "sonner";

type SettingRow = { key: string; value_text: string | null; value_url: string | null };

const SETTINGS: { key: string; label: string; description: string; bucket: Bucket }[] = [
  {
    key: "hierarchy_image_url",
    label: "Hierarchy diagram",
    description: "Shown on the About → Hierarchy page.",
    bucket: "photos",
  },
  {
    key: "ranks_master_pdf_url",
    label: "Ranks master PDF",
    description: "Linked from the About → Ranks page.",
    bucket: "pdfs",
  },
];

export default function SiteSettingsPage() {
  const qc = useQueryClient();
  const queryKey = ["admin", "site_settings"];

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<SettingRow[]> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value_text, value_url")
        .in(
          "key",
          SETTINGS.map((s) => s.key),
        );
      if (error) throw error;
      return data ?? [];
    },
  });

  const byKey = Object.fromEntries(rows.map((r) => [r.key, r])) as Record<string, SettingRow | undefined>;

  const save = useMutation({
    mutationFn: async ({ key, value_url }: { key: string; value_url: string | null }) => {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key, value_url, updated_at: new Date().toISOString() },
          { onConflict: "key" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Site settings</h1>
        <p className="text-sm text-muted-foreground">
          Page-wide media references. Changes save automatically when you upload or remove a file.
        </p>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading…</div>}
      {error && <div className="text-red-600">{(error as Error).message}</div>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {SETTINGS.map((s) => (
            <div
              key={s.key}
              className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-800 p-5 space-y-3"
            >
              <div>
                <p className="font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{s.key}</p>
              </div>
              <FileUploadField
                bucket={s.bucket}
                value={byKey[s.key]?.value_url ?? null}
                onChange={(url) => save.mutate({ key: s.key, value_url: url })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
