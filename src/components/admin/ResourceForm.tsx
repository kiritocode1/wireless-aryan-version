import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import FileUploadField from "./FileUploadField";
import { FieldDef } from "@/lib/admin/types";

type Props = {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  submitLabel?: string;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
};

export default function ResourceForm({ fields, initial, submitLabel = "Save", onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...initial }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (name: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [name]: value }));

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => {
        const value = values[f.name];
        if (f.type === "text") {
          return (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>
                {f.label}
                {f.required ? " *" : ""}
              </Label>
              <Input
                id={f.name}
                value={(value as string) ?? ""}
                placeholder={f.placeholder}
                required={f.required}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === "textarea") {
          return (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>
                {f.label}
                {f.required ? " *" : ""}
              </Label>
              <Textarea
                id={f.name}
                value={(value as string) ?? ""}
                placeholder={f.placeholder}
                required={f.required}
                rows={4}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === "date") {
          return (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>
                {f.label}
                {f.required ? " *" : ""}
              </Label>
              <Input
                id={f.name}
                type="date"
                value={(value as string) ?? ""}
                required={f.required}
                onChange={(e) => setField(f.name, e.target.value || null)}
              />
            </div>
          );
        }
        if (f.type === "number") {
          return (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name}>
                {f.label}
                {f.required ? " *" : ""}
              </Label>
              <Input
                id={f.name}
                type="number"
                value={(value as number | string | null) ?? ""}
                required={f.required}
                onChange={(e) => setField(f.name, e.target.value === "" ? null : Number(e.target.value))}
              />
            </div>
          );
        }
        if (f.type === "boolean") {
          return (
            <div key={f.name} className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor={f.name}>{f.label}</Label>
              <Switch
                id={f.name}
                checked={value === true}
                onCheckedChange={(checked) => setField(f.name, checked)}
              />
            </div>
          );
        }
        if (f.type === "file") {
          return (
            <FileUploadField
              key={f.name}
              label={f.label + (f.required ? " *" : "")}
              bucket={f.bucket}
              value={(value as string) ?? null}
              onChange={(url) => setField(f.name, url)}
            />
          );
        }
        return null;
      })}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
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
