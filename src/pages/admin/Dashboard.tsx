import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { resourceConfigs } from "@/lib/admin/resources";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RelativeTime from "@/components/admin/RelativeTime";
import { ArrowUpRight, FileText, Image as ImageIcon, Pencil } from "lucide-react";
import type { Database } from "@/lib/database.types";

type TableName = keyof Database["public"]["Tables"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tbl = (name: string): any => supabase.from(name as TableName);

type RecentItem = {
  table: string;
  slug: string;
  singular: string;
  id: string | number;
  title: string;
  updated_at: string;
  photo_url: string | null;
  pdf_url: string | null;
};

export default function AdminDashboard() {
  const { session } = useAuth();

  const { data: counts = {}, isLoading: countsLoading } = useQuery({
    queryKey: ["admin", "dashboard", "counts"],
    queryFn: async (): Promise<Record<string, number>> => {
      const results = await Promise.all(
        resourceConfigs.map(async (c) => {
          const { count, error } = await tbl(c.table).select("*", { count: "exact", head: true });
          if (error) return [c.table, 0] as const;
          return [c.table, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(results);
    },
  });

  const { data: recent = [], isLoading: recentLoading } = useQuery({
    queryKey: ["admin", "dashboard", "recent"],
    queryFn: async (): Promise<RecentItem[]> => {
      const results = await Promise.all(
        resourceConfigs.map(async (c) => {
          const titleField = pickTitleField(c.fields.map((f) => f.name));
          const cols = ["id", "updated_at", titleField, "photo_url", "pdf_url"]
            .filter(Boolean)
            .join(", ");
          const { data, error } = await tbl(c.table)
            .select(cols)
            .order("updated_at", { ascending: false })
            .limit(3);
          if (error || !data) return [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (data as any[]).map((row) => ({
            table: c.table,
            slug: c.slug,
            singular: c.singular,
            id: row.id,
            title: String(row[titleField] ?? c.singular),
            updated_at: row.updated_at,
            photo_url: row.photo_url ?? null,
            pdf_url: row.pdf_url ?? null,
          }));
        }),
      );
      return results
        .flat()
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 8);
    },
  });

  const groups = groupBy(resourceConfigs, (c) => c.group);
  const totalItems = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description={`Signed in as ${session?.user.email ?? "—"}`}
        meta={
          <span>
            {countsLoading ? "…" : totalItems} items across {resourceConfigs.length} collections
          </span>
        }
      />

      {/* Group counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {groups.map(([group, items]) => {
          const total = items.reduce((s, c) => s + (counts[c.table] ?? 0), 0);
          return (
            <Card key={group} className="bg-white dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{group}</p>
                <p className="text-2xl font-semibold mt-1">
                  {countsLoading ? <Skeleton className="h-7 w-12" /> : total}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {items.length} collection{items.length === 1 ? "" : "s"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recently updated feed */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recently updated</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">No edits yet.</p>
            ) : (
              <ul className="divide-y dark:divide-gray-800">
                {recent.map((r) => (
                  <li key={`${r.table}-${r.id}`}>
                    <Link
                      to={`/admin/${r.slug}`}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                    >
                      <Thumb photo={r.photo_url} pdf={r.pdf_url} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] font-normal py-0">
                            {r.singular}
                          </Badge>
                          <RelativeTime iso={r.updated_at} prefix="Updated" />
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Shortcuts */}
        <Card className="bg-white dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick edit</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y dark:divide-gray-800">
              {QUICK_LINKS.map((q) => (
                <li key={q.slug}>
                  <Link
                    to={`/admin/${q.slug}`}
                    className="flex items-center gap-3 p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{q.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Thumb({ photo, pdf }: { photo: string | null; pdf: string | null }) {
  if (photo) {
    return <img src={photo} alt="" className="w-10 h-10 rounded object-cover shrink-0" />;
  }
  return (
    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-muted-foreground">
      {pdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
    </div>
  );
}

function pickTitleField(fieldNames: string[]): string {
  return (
    fieldNames.find((n) => n === "title_en") ??
    fieldNames.find((n) => n === "name_en") ??
    fieldNames.find((n) => n === "rank_en") ??
    fieldNames.find((n) => n === "label_en") ??
    fieldNames.find((n) => n === "course_name_en") ??
    fieldNames.find((n) => n === "slug") ??
    fieldNames.find((n) => n === "year") ??
    fieldNames[0] ?? "id"
  );
}

function groupBy<T, K>(arr: T[], key: (t: T) => K): [K, T[]][] {
  const m = new Map<K, T[]>();
  for (const item of arr) {
    const k = key(item);
    const list = m.get(k) ?? [];
    list.push(item);
    m.set(k, list);
  }
  return Array.from(m.entries());
}

const QUICK_LINKS: { slug: string; label: string }[] = [
  { slug: "directors-desk", label: "Director's Desk" },
  { slug: "home-slider", label: "Home slider" },
  { slug: "press-releases", label: "Press releases" },
  { slug: "photo-gallery", label: "Photo gallery" },
];
