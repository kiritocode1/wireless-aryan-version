import { useMemo, useRef, useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  ExternalLink,
  Search,
  LayoutGrid,
  Rows3,
  MoreHorizontal,
  Copy,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { useHotkey } from "@/hooks/useHotkey";
import ResourceForm from "@/components/admin/ResourceForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { TableSkeleton, GridSkeleton } from "@/components/admin/ListSkeleton";
import RelativeTime from "@/components/admin/RelativeTime";
import { resourceConfigs } from "@/lib/admin/resources";
import { getGroupTheme } from "@/lib/admin/group-theme";
import { ResourceConfig, ListColumnDef, FieldDef } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
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
  const [initialFromDuplicate, setInitialFromDuplicate] = useState<Record<string, unknown> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [query, setQuery] = useState("");
  const hasPhoto = config.listColumns.some((c) => c.render === "image");
  const [view, setView] = useState<"table" | "grid">(hasPhoto ? "grid" : "table");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" } | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const isDialogOpen = creating || editingRow !== null;
  useHotkey(["n"], () => { setCreating(true); setEditingRow(null); }, { enabled: !isDialogOpen });
  useHotkey(["/"], () => searchRef.current?.focus(), { enabled: !isDialogOpen });

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
      setInitialFromDuplicate(null);
      toast.success("Saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, display_order }: { id: string | number; display_order: number }) => {
      const { error } = await tbl(config.table)
        .update({ display_order, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
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
    const base = !query.trim()
      ? rows
      : rows.filter((row) =>
          Object.values(row).some(
            (v) => typeof v === "string" && v.toLowerCase().includes(query.toLowerCase()),
          ),
        );
    if (!sort) return base;
    const copy = [...base];
    copy.sort((a, b) => {
      const av = a[sort.field];
      const bv = b[sort.field];
      const cmp = compare(av, bv);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, query, sort]);

  const titleField = pickTitleField(config.fields);
  const photoField = config.fields.find((f) => f.type === "file" && f.bucket === "photos")?.name;
  const hasOrder = config.fields.some((f) => f.name === "display_order");
  const publicHref = publicLinkForSlug(config.slug);

  const handleDuplicate = (row: Row) => {
    const clone: Record<string, unknown> = {};
    for (const f of config.fields) clone[f.name] = row[f.name];
    setInitialFromDuplicate(clone);
    setCreating(true);
    setEditingRow(null);
  };

  const handleMove = (row: Row, dir: "up" | "down") => {
    if (!hasOrder || row.id == null) return;
    // Use the row's current rank within the sorted list of all rows
    const ordered = [...rows].sort((a, b) =>
      compare(a.display_order ?? 0, b.display_order ?? 0),
    );
    const idx = ordered.findIndex((r) => r.id === row.id);
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= ordered.length) return;
    const a = ordered[idx];
    const b = ordered[target];
    // Swap their display_order values.
    const ao = (a.display_order as number | undefined) ?? idx;
    const bo = (b.display_order as number | undefined) ?? target;
    reorderMutation.mutate({ id: a.id as string, display_order: bo });
    reorderMutation.mutate({ id: b.id as string, display_order: ao });
  };

  const theme = getGroupTheme(config.group);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={config.plural}
        description={`Manage ${config.plural.toLowerCase()}.`}
        meta={
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                theme.badge,
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", theme.dot)} />
              {config.group}
            </span>
            <span>
              {isLoading
                ? "Loading…"
                : `${filteredRows.length} of ${rows.length} ${rows.length === 1 ? "item" : "items"}`}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            {publicHref && (
              <a
                href={publicHref}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex"
              >
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1.5" /> View on site
                </Button>
              </a>
            )}
            <Button onClick={() => { setInitialFromDuplicate(null); setCreating(true); }}>
              <Plus className="w-4 h-4 mr-1.5" /> New {config.singular}
              <span className="ml-2 hidden sm:inline-flex font-mono text-[10px] opacity-70">N</span>
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            placeholder={`Search ${config.plural.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); e.currentTarget.blur(); } }}
            className="pl-8 pr-12"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground border bg-white dark:bg-gray-900 dark:border-gray-800">
            /
          </kbd>
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
            icon={<Plus className="w-6 h-6" />}
            title={`No ${config.plural.toLowerCase()} yet`}
            description={`Start by adding your first ${config.singular.toLowerCase()}. Everything you save here will show up on the public site instantly.`}
            action={
              <Button size="lg" onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Add your first {config.singular.toLowerCase()}
              </Button>
            }
            hint={`This collection has ${config.fields.length} field${config.fields.length === 1 ? "" : "s"} to fill out`}
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
          onDuplicate={handleDuplicate}
          onMove={hasOrder ? handleMove : undefined}
        />
      ) : (
        <TableView
          rows={filteredRows}
          config={config}
          sort={sort}
          onSort={(field) => {
            setSort((cur) =>
              !cur || cur.field !== field
                ? { field, dir: "asc" }
                : cur.dir === "asc"
                ? { field, dir: "desc" }
                : null,
            );
          }}
          onEdit={setEditingRow}
          onDelete={setDeleteTarget}
          onDuplicate={handleDuplicate}
          onMove={hasOrder ? handleMove : undefined}
        />
      )}

      <Dialog
        open={creating || editingRow !== null}
        onOpenChange={(open) => {
          if (open) return;
          // unsaved guard is handled inside ResourceForm via window confirm only when dirty
          setEditingRow(null);
          setCreating(false);
          setInitialFromDuplicate(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {creating
                ? initialFromDuplicate
                  ? `Duplicate ${config.singular}`
                  : `New ${config.singular}`
                : `Edit ${config.singular}`}
            </DialogTitle>
          </DialogHeader>
          <ResourceForm
            fields={config.fields}
            initial={editingRow ?? initialFromDuplicate ?? buildDefaults(config)}
            confirmOnDirty
            onSubmit={async (values) => {
              await saveMutation.mutateAsync({ id: editingRow?.id, values });
            }}
            onCancel={() => {
              setEditingRow(null);
              setCreating(false);
              setInitialFromDuplicate(null);
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
  sort,
  onSort,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
}: {
  rows: Row[];
  config: ResourceConfig;
  sort: { field: string; dir: "asc" | "desc" } | null;
  onSort: (field: string) => void;
  onEdit: (r: Row) => void;
  onDelete: (r: Row) => void;
  onDuplicate: (r: Row) => void;
  onMove?: (r: Row, dir: "up" | "down") => void;
}) {
  return (
    <div className="rounded-md border bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-left">
            <tr>
              {config.listColumns.map((col) => {
                const active = sort?.field === col.field;
                return (
                  <th
                    key={col.field}
                    className="px-4 py-3 font-medium text-muted-foreground select-none cursor-pointer hover:text-foreground transition"
                    onClick={() => onSort(col.field)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon active={active} dir={sort?.dir} />
                    </span>
                  </th>
                );
              })}
              <th
                className="px-4 py-3 font-medium text-muted-foreground select-none cursor-pointer hover:text-foreground transition"
                onClick={() => onSort("updated_at")}
              >
                <span className="inline-flex items-center gap-1">
                  Updated
                  <SortIcon active={sort?.field === "updated_at"} dir={sort?.dir} />
                </span>
              </th>
              <th className="px-4 py-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={String(row.id)}
                className="border-t dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition"
              >
                {config.listColumns.map((col) => (
                  <td key={col.field} className="px-4 py-3 align-middle">
                    <CellValue value={row[col.field]} col={col} />
                  </td>
                ))}
                <td className="px-4 py-3 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {row.updated_at ? <RelativeTime iso={row.updated_at} /> : "—"}
                </td>
                <td className="px-2 py-2 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-0.5">
                    {onMove && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Move up"
                          disabled={idx === 0}
                          onClick={() => onMove(row, "up")}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Move down"
                          disabled={idx === rows.length - 1}
                          onClick={() => onMove(row, "down")}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(row)} aria-label="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <RowMenu onDuplicate={() => onDuplicate(row)} onDelete={() => onDelete(row)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir?: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return dir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
}

function RowMenu({ onDuplicate, onDelete }: { onDuplicate: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="More actions">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="w-4 h-4 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  onDuplicate,
  onMove,
}: {
  rows: Row[];
  photoField: string;
  titleField: string | null;
  config: ResourceConfig;
  onEdit: (r: Row) => void;
  onDelete: (r: Row) => void;
  onDuplicate: (r: Row) => void;
  onMove?: (r: Row, dir: "up" | "down") => void;
}) {
  const subtitleField = pickSubtitleField(config.fields, titleField);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rows.map((row, idx) => {
        const photo = row[photoField] as string | null;
        const title = titleField ? (row[titleField] as string | null) : null;
        const subtitle = subtitleField ? (row[subtitleField] as string | null) : null;
        return (
          <div
            key={String(row.id)}
            className="group relative rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <button
              type="button"
              onClick={() => onEdit(row)}
              className="block relative aspect-[4/3] bg-gray-100 dark:bg-gray-800"
            >
              {photo ? (
                <img src={photo} alt={title ?? ""} className="w-full h-full object-cover transition group-hover:scale-[1.02]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <FileText className="w-8 h-8" />
                </div>
              )}
              {row.is_active === false && (
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
                <div className="flex items-center gap-0.5">
                  {onMove && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === 0}
                        onClick={() => onMove(row, "up")}
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === rows.length - 1}
                        onClick={() => onMove(row, "down")}
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(row)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <RowMenu onDuplicate={() => onDuplicate(row)} onDelete={() => onDelete(row)} />
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

  const theme = getGroupTheme(config.group);

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title={config.singular}
        description="Edit the single record for this section."
        meta={
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                theme.badge,
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", theme.dot)} />
              {config.group}
            </span>
            {row?.updated_at && <RelativeTime iso={row.updated_at} prefix="Last updated" />}
          </div>
        }
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

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

// Map admin slugs to their public routes so "View on site" works.
function publicLinkForSlug(slug: string): string | null {
  const map: Record<string, string> = {
    "home-slider": "/",
    "directors-desk": "/director-message",
    "former-directors": "/former-directors",
    "office-sections": "/officers-hq",
    "ranks": "/about-department",
    "press-releases": "/press-release",
    "tenders": "/tender",
    "recruitments": "/recruitments",
    "rti-documents": "/rti",
    "gazettes": "/gazette",
    "promotion-orders": "/promotion-orders",
    "transfer-orders": "/transfer-orders",
    "gradation-lists": "/gradation-list",
    "officers": "/list-of-officers",
    "training-calendars": "/training-calendar",
    "training-schedules": "/training-calendar",
    "faculty": "/faculty",
    "welfare-activities": "/welfare-activities",
    "photo-gallery": "/photo-gallery",
    "bulletins": "/",
    "impact-stats": "/",
  };
  return map[slug] ?? null;
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
