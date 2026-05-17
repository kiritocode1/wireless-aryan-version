import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, ImageIcon } from "lucide-react";
import { Bucket, uploadFile } from "@/lib/admin/storage";
import { toast } from "sonner";

type Props = {
  label?: string;
  bucket: Bucket;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
};

export default function FileUploadField({ label, bucket, value, onChange, accept }: Props) {
  const [uploading, setUploading] = useState(false);
  const isImage = bucket === "photos";

  const handleSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(bucket, file);
      onChange(url);
      toast.success("Uploaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {value ? (
        <div className="flex items-start gap-3 rounded-md border p-3">
          {isImage ? (
            <img src={value} alt="" className="w-20 h-20 object-cover rounded" />
          ) : (
            <div className="w-20 h-20 rounded bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {value.split("/").pop()}
            </a>
            <div className="mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label className="flex items-center gap-2 rounded-md border border-dashed p-4 cursor-pointer hover:bg-muted/30 transition">
          {isImage ? (
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {uploading ? "Uploading…" : `Click to upload ${isImage ? "photo" : "PDF"}`}
          </span>
          <input
            type="file"
            className="hidden"
            accept={accept ?? (isImage ? "image/*" : "application/pdf")}
            onChange={handleSelect}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
