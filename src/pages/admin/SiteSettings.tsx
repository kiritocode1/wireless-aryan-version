import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import FileUploadField from "@/components/admin/FileUploadField";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RelativeTime from "@/components/admin/RelativeTime";
import { Bucket } from "@/lib/admin/storage";
import { toast } from "sonner";

type SettingRow = {
  key: string;
  value_text: string | null;
  value_url: string | null;
  updated_at: string | null;
};

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
        .select("key, value_text, value_url, updated_at")
        .in("key", SETTINGS.map((s) => s.key));
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
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Site settings"
        description="Page-wide media references. Changes save automatically when you upload or remove a file."
      />

      {isLoading && <div className="text-muted-foreground text-sm">Loading…</div>}
      {error && <div className="text-red-600 text-sm">{(error as Error).message}</div>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {SETTINGS.map((s) => {
            const row = byKey[s.key];
            return (
              <div
                key={s.key}
                className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-800 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{s.key}</p>
                  </div>
                  {row?.updated_at && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      <RelativeTime iso={row.updated_at} prefix="Updated" />
                    </span>
                  )}
                </div>
                <FileUploadField
                  bucket={s.bucket}
                  value={row?.value_url ?? null}
                  onChange={(url) => save.mutate({ key: s.key, value_url: url })}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
