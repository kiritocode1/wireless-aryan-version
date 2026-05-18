import { Bucket } from "./storage";

export type FieldDef =
  | {
      name: string;
      label: string;
      type: "text" | "textarea" | "date" | "number";
      required?: boolean;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "boolean";
      required?: boolean;
    }
  | {
      name: string;
      label: string;
      type: "file";
      bucket: Bucket;
      required?: boolean;
    };

export type ListColumnDef = {
  field: string;
  label: string;
  render?: "text" | "date" | "image" | "pdf" | "boolean";
};

export type ResourceConfig = {
  table: string;
  slug: string;            // URL slug under /admin/
  singular: string;
  plural: string;
  group: string;           // sidebar grouping
  singleton?: boolean;     // true → one-row table (e.g. director_current)
  singletonId?: number | string; // pk value for the lone row
  orderBy?: { column: string; ascending?: boolean };
  listColumns: ListColumnDef[];
  fields: FieldDef[];
};
