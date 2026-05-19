import { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  ExternalLink,
  Search,
  LayoutGrid,
  Rows3,
  Inbox,
} from "lucide-react";
import ResourceForm from "@/components/admin/ResourceForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { TableSkeleton, GridSkeleton } from "@/components/admin/ListSkeleton";
import RelativeTime from "@/components/admin/RelativeTime";
import { resourceConfigs } from "@/lib/admin/resources";
import { ResourceConfig, ListColumnDef, FieldDef } from "@/lib/admin/types";
import { toast } from "sonner";
import type { Database } from "@/lib/database.types";

type TableName = keyof Database["public"]["Tables"];
type Row = Record<string, unknown> & { id?: string | number; updated_at?: string };

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
  const [query, setQuery] = useState("");
  const hasPhoto = config.listColumns.some((c) => c.render === "image");
  const [view, setView] = useState<"table" | "grid">(hasPhoto ? "grid" : "table");

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

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((v) => typeof v === "string" && v.toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const titleField = pickTitleField(config.fields);
  const photoField = config.fields.find((f) => f.type === "file" && f.bucket === "photos")?.name;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={config.plural}
        description={`Manage ${config.plural.toLowerCase()}.`}
        meta={
          <span>
            {isLoading ? "Loading…" : `${filteredRows.length} of ${rows.length} ${rows.length === 1 ? "item" : "items"}`}
          </span>
        }
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> New {config.singular}
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${config.plural.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {hasPhoto && (
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as "table" | "grid")}
            className="self-start sm:self-auto"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <Rows3 className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      {isLoading ? (
        view === "grid" ? <GridSkeleton /> : <TableSkeleton cols={Math.min(config.listColumns.length + 1, 5)} />
      ) : error ? (
        <p className="text-center py-12 text-red-600">{(error as Error).message}</p>
      ) : filteredRows.length === 0 ? (
        rows.length === 0 ? (
          <EmptyState
            icon={<Inbox className="w-6 h-6" />}
            title={`No ${config.plural.toLowerCase()} yet`}
            description={`Click "New ${config.singular}" to add your first one.`}
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> New {config.singular}
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No matches"
            description={`Nothing matched "${query}". Try a different search.`}
            action={
              <Button variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        )
      ) : view === "grid" && photoField ? (
        <GridView
          rows={filteredRows}
          photoField={photoField}
          titleField={titleField}
          config={config}
          onEdit={setEditingRow}
          onDelete={setDeleteTarget}
        />
      ) : (
        <TableView
          rows={filteredRows}
          config={config}
          onEdit={setEditingRow}
          onDelete={setDeleteTarget}
        />
      )}

      <Dialog
        open={creating || editingRow !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRow(null);
            setCreating(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
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
            onCancel={() => {
              setEditingRow(null);
              setCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && titleField && (
                <span className="block mt-1 font-medium text-foreground">
                  {String(deleteTarget[titleField] ?? "Untitled")}
                </span>
              )}
              <span className="block mt-2">This cannot be undone.</span>
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

// ---------- TABLE VIEW ----------
function TableView({
  rows,
  config,
  onEdit,
  onDelete,
}: {
  rows: Row[];
  config: ResourceConfig;
  onEdit: (r: Row) => void;
  onDelete: (r: Row) => void;
}) {
  return (
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
              <th className="px-4 py-3 font-medium text-muted-foreground">Updated</th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={String(row.id)}
                className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
              >
                {config.listColumns.map((col) => (
                  <td key={col.field} className="px-4 py-3 align-middle">
                    <CellValue value={row[col.field]} col={col} />
                  </td>
                ))}
                <td className="px-4 py-3 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {row.updated_at ? <RelativeTime iso={row.updated_at} /> : "—"}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(row)} aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- GRID VIEW ----------
function GridView({
  rows,
  photoField,
  titleField,
  config,
  onEdit,
  onDelete,
}: {
  rows: Row[];
  photoField: string;
  titleField: string | null;
  config: ResourceConfig;
  onEdit: (r: Row) => void;
  onDelete: (r: Row) => void;
}) {
  const subtitleField = pickSubtitleField(config.fields, titleField);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rows.map((row) => {
        const photo = row[photoField] as string | null;
        const title = titleField ? (row[titleField] as string | null) : null;
        const subtitle = subtitleField ? (row[subtitleField] as string | null) : null;
        return (
          <div
            key={String(row.id)}
            className="group rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-md transition"
          >
            <button
              type="button"
              onClick={() => onEdit(row)}
              className="block relative aspect-[4/3] bg-gray-100 dark:bg-gray-800"
            >
              {photo ? (
                <img src={photo} alt={title ?? ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <FileText className="w-8 h-8" />
                </div>
              )}
              {!row.is_active && row.is_active === false && (
                <Badge variant="secondary" className="absolute top-2 left-2">Inactive</Badge>
              )}
            </button>
            <div className="p-3 flex-1 flex flex-col">
              <p className="text-sm font-medium truncate">{title ?? "—"}</p>
              {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {row.updated_at ? <RelativeTime iso={row.updated_at} /> : ""}
                </span>
                <div className="flex">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(row)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(row)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
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
      const { data, error } = await tbl(config.table).select("*").eq("id", id).maybeSingle();
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

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title={config.singular}
        description="Edit the single record for this section."
        meta={row?.updated_at ? <RelativeTime iso={row.updated_at} prefix="Last updated" /> : undefined}
      />
      <div className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-800 p-6">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : (
          <ResourceForm
            fields={config.fields}
            initial={row ?? buildDefaults(config)}
            onSubmit={async (values) => {
              await saveMutation.mutateAsync(values);
            }}
          />
        )}
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
  out.updated_at = new Date().toISOString();
  return out;
}

function pickTitleField(fields: FieldDef[]): string | null {
  const names = fields.map((f) => f.name);
  return (
    names.find((n) => n === "title_en") ??
    names.find((n) => n === "name_en") ??
    names.find((n) => n === "rank_en") ??
    names.find((n) => n === "label_en") ??
    names.find((n) => n === "course_name_en") ??
    names.find((n) => n === "slug") ??
    names.find((n) => n === "year") ??
    null
  );
}

function pickSubtitleField(fields: FieldDef[], title: string | null): string | null {
  const names = fields.map((f) => f.name).filter((n) => n !== title);
  return (
    names.find((n) => n === "designation_en") ??
    names.find((n) => n === "tenure") ??
    names.find((n) => n === "published_date") ??
    names.find((n) => n === "subtitle_en") ??
    null
  );
}

function CellValue({ value, col }: { value: unknown; col: ListColumnDef }) {
  if (value == null || value === "") return <span className="text-muted-foreground">—</span>;
  if (col.render === "image" && typeof value === "string") {
    return <img src={value} alt="" className="w-12 h-12 object-cover rounded" />;
  }
  if (col.render === "pdf" && typeof value === "string") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
      >
        <FileText className="w-3.5 h-3.5" /> PDF <ExternalLink className="w-3 h-3" />
      </a>
    );
  }
  if (col.render === "boolean") {
    return value === true ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Yes</Badge>
    ) : (
      <Badge variant="secondary">No</Badge>
    );
  }
  if (col.render === "date" && typeof value === "string") {
    return <span>{value}</span>;
  }
  return <span className="line-clamp-2">{String(value)}</span>;
}
