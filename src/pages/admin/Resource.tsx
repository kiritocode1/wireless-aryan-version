import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import ResourceForm from "@/components/admin/ResourceForm";
import { resourceConfigs } from "@/lib/admin/resources";
import { ResourceConfig, ListColumnDef } from "@/lib/admin/types";
import { toast } from "sonner";
import type { Database } from "@/lib/database.types";

type TableName = keyof Database["public"]["Tables"];
type Row = Record<string, unknown> & { id?: string | number };

// Dynamic table name escapes the typed union — every chain after tbl() is untyped.
// Use the directly-typed supabase.from(...) elsewhere; this helper is only for the
// generic CRUD page where the table is decided at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tbl = (name: string): any => supabase.from(name as TableName);

export default function ResourcePage() {
  const { slug } = useParams<{ slug: string }>();
  const config = resourceConfigs.find((c) => c.slug === slug);

  if (!config) return <Navigate to="/admin" replace />;

  return config.singleton ? <SingletonView config={config} /> : <ListView config={config} />;
}

// ---------- LIST VIEW ----------
function ListView({ config }: { config: ResourceConfig }) {
  const qc = useQueryClient();
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const queryKey = ["admin", config.table];
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      let q = tbl(config.table).select("*");
      if (config.orderBy) {
        q = q.order(config.orderBy.column, { ascending: config.orderBy.ascending ?? true });
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, values }: { id?: string | number; values: Record<string, unknown> }) => {
      const payload = cleanPayload(values, config);
      if (id != null) {
        const { error } = await tbl(config.table).update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await tbl(config.table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      setEditingRow(null);
      setCreating(false);
      toast.success("Saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await tbl(config.table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      setDeleteTarget(null);
      toast.success("Deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{config.plural}</h1>
          <p className="text-sm text-muted-foreground">{rows.length} item{rows.length === 1 ? "" : "s"}</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> New {config.singular}
        </Button>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-left">
              <tr>
                {config.listColumns.map((col) => (
                  <th key={col.field} className="px-4 py-3 font-medium text-muted-foreground">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={config.listColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={config.listColumns.length + 1} className="px-4 py-8 text-center text-red-600">
                    {(error as Error).message}
                  </td>
                </tr>
              )}
              {!isLoading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={config.listColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    No items yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={String(row.id)} className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  {config.listColumns.map((col) => (
                    <td key={col.field} className="px-4 py-3 align-top">
                      <CellValue value={row[col.field]} col={col} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => setEditingRow(row)} aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)} aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={creating || editingRow !== null} onOpenChange={(open) => { if (!open) { setEditingRow(null); setCreating(false); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {creating ? `New ${config.singular}` : `Edit ${config.singular}`}
            </DialogTitle>
          </DialogHeader>
          <ResourceForm
            fields={config.fields}
            initial={editingRow ?? buildDefaults(config)}
            onSubmit={async (values) => {
              await saveMutation.mutateAsync({ id: editingRow?.id, values });
            }}
            onCancel={() => { setEditingRow(null); setCreating(false); }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget?.id != null && deleteMutation.mutate(deleteTarget.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------- SINGLETON VIEW ----------
function SingletonView({ config }: { config: ResourceConfig }) {
  const qc = useQueryClient();
  const queryKey = ["admin", config.table, "singleton"];
  const id = config.singletonId ?? 1;

  const { data: row, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await tbl(config.table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Row | null;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = cleanPayload(values, config);
      const { error } = await tbl(config.table).upsert({ id, ...payload });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">{config.singular}</h1>
        <p className="text-sm text-muted-foreground">Edit the single record for this section.</p>
      </div>
      <div className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-800 p-6">
        <ResourceForm
          fields={config.fields}
          initial={row ?? buildDefaults(config)}
          onSubmit={async (values) => { await saveMutation.mutateAsync(values); }}
        />
      </div>
    </div>
  );
}

// ---------- HELPERS ----------
function buildDefaults(config: ResourceConfig): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of config.fields) {
    if (f.type === "boolean") out[f.name] = false;
    else out[f.name] = null;
  }
  return out;
}

function cleanPayload(values: Record<string, unknown>, config: ResourceConfig): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const allowed = new Set(config.fields.map((f) => f.name));
  for (const [k, v] of Object.entries(values)) {
    if (!allowed.has(k)) continue;
    if (typeof v === "string" && v.trim() === "") out[k] = null;
    else out[k] = v;
  }
  // Stamp updated_at on every admin write (insert, update, upsert) so the
  // timestamp reflects the latest asset/content change even if the DB trigger
  // is bypassed. Server-side trigger remains the source of truth.
  out.updated_at = new Date().toISOString();
  return out;
}

function CellValue({ value, col }: { value: unknown; col: ListColumnDef }) {
  if (value == null || value === "") return <span className="text-muted-foreground">—</span>;
  if (col.render === "image" && typeof value === "string") {
    return <img src={value} alt="" className="w-12 h-12 object-cover rounded" />;
  }
  if (col.render === "pdf" && typeof value === "string") {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
        <FileText className="w-3.5 h-3.5" /> PDF <ExternalLink className="w-3 h-3" />
      </a>
    );
  }
  if (col.render === "boolean") {
    return <span>{value === true ? "Yes" : "No"}</span>;
  }
  if (col.render === "date" && typeof value === "string") {
    return <span>{value}</span>;
  }
  return <span className="line-clamp-2">{String(value)}</span>;
}
