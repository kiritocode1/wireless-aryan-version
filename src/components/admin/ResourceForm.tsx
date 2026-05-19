import { FormEvent, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import FileUploadField from "./FileUploadField";
import { FieldDef } from "@/lib/admin/types";
import { AlertCircle } from "lucide-react";

type Props = {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  submitLabel?: string;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
};

// A row in the layout: either a single field or a paired (EN/MR) field.
type LayoutRow = { kind: "single"; field: FieldDef } | { kind: "pair"; en: FieldDef; mr: FieldDef };

export default function ResourceForm({
  fields,
  initial,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...initial }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (name: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const layout = useMemo(() => buildLayout(fields), [fields]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {layout.map((row, idx) => {
        if (row.kind === "pair") {
          return (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldRenderer field={row.en} value={values[row.en.name]} setField={setField} />
              <FieldRenderer field={row.mr} value={values[row.mr.name]} setField={setField} />
            </div>
          );
        }
        return (
          <FieldRenderer
            key={row.field.name}
            field={row.field}
            value={values[row.field.name]}
            setField={setField}
          />
        );
      })}

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-3 border-t dark:border-gray-800">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function FieldRenderer({
  field,
  value,
  setField,
}: {
  field: FieldDef;
  value: unknown;
  setField: (name: string, value: unknown) => void;
}) {
  const required = field.type !== "file" && field.type !== "boolean" ? field.required : field.required;
  const labelEl = (
    <Label htmlFor={field.name} className="flex items-center gap-1.5">
      <span>{field.label}</span>
      {required && <span className="text-red-600">*</span>}
      <LangBadge name={field.name} />
    </Label>
  );

  if (field.type === "text") {
    return (
      <div className="space-y-1.5">
        {labelEl}
        <Input
          id={field.name}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => setField(field.name, e.target.value)}
        />
      </div>
    );
  }
  if (field.type === "textarea") {
    const str = (value as string) ?? "";
    return (
      <div className="space-y-1.5">
        <div className="flex items-end justify-between">
          {labelEl}
          <span className="text-xs text-muted-foreground">{str.length} chars</span>
        </div>
        <Textarea
          id={field.name}
          value={str}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
          onChange={(e) => setField(field.name, e.target.value)}
        />
      </div>
    );
  }
  if (field.type === "date") {
    return (
      <div className="space-y-1.5">
        {labelEl}
        <Input
          id={field.name}
          type="date"
          value={(value as string) ?? ""}
          required={field.required}
          onChange={(e) => setField(field.name, e.target.value || null)}
        />
      </div>
    );
  }
  if (field.type === "number") {
    return (
      <div className="space-y-1.5">
        {labelEl}
        <Input
          id={field.name}
          type="number"
          value={(value as number | string | null) ?? ""}
          required={field.required}
          onChange={(e) => setField(field.name, e.target.value === "" ? null : Number(e.target.value))}
        />
      </div>
    );
  }
  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between rounded-md border p-3 dark:border-gray-800">
        <Label htmlFor={field.name} className="cursor-pointer">{field.label}</Label>
        <Switch
          id={field.name}
          checked={value === true}
          onCheckedChange={(checked) => setField(field.name, checked)}
        />
      </div>
    );
  }
  if (field.type === "file") {
    return (
      <FileUploadField
        label={field.label + (field.required ? " *" : "")}
        bucket={field.bucket}
        value={(value as string) ?? null}
        onChange={(url) => setField(field.name, url)}
      />
    );
  }
  return null;
}

function LangBadge({ name }: { name: string }) {
  if (name.endsWith("_en")) {
    return <Badge variant="secondary" className="text-[9px] font-medium py-0 px-1.5">EN</Badge>;
  }
  if (name.endsWith("_mr")) {
    return <Badge variant="secondary" className="text-[9px] font-medium py-0 px-1.5">MR</Badge>;
  }
  return null;
}

// Pair fields ending in _en with their _mr sibling so they render side-by-side.
function buildLayout(fields: FieldDef[]): LayoutRow[] {
  const used = new Set<string>();
  const out: LayoutRow[] = [];
  for (const f of fields) {
    if (used.has(f.name)) continue;
    if (f.name.endsWith("_en") && (f.type === "text" || f.type === "textarea")) {
      const mrName = f.name.replace(/_en$/, "_mr");
      const mr = fields.find((g) => g.name === mrName && g.type === f.type);
      if (mr) {
        out.push({ kind: "pair", en: f, mr });
        used.add(f.name);
        used.add(mr.name);
        continue;
      }
    }
    out.push({ kind: "single", field: f });
    used.add(f.name);
  }
  return out;
}
