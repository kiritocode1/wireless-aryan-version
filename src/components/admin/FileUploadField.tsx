import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  FileText,
  ImageIcon,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const isImage = bucket === "photos";
  const defaultAccept = accept ?? (isImage ? "image/*" : "application/pdf");

  const upload = async (file: File) => {
    setUploading(true);
    setProgress(15);
    const tick = setInterval(() => setProgress((p) => Math.min(p + 10, 85)), 200);
    try {
      const url = await uploadFile(bucket, file);
      setProgress(100);
      onChange(url);
      toast.success("Uploaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      clearInterval(tick);
      setUploading(false);
      setTimeout(() => setProgress(0), 400);
    }
  };

  const handleSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await upload(file);
  };

  const handleDrop = async (e: DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await upload(file);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={defaultAccept}
        onChange={handleSelect}
        disabled={uploading}
      />

      {value ? (
        <div
          onDrop={handleDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex items-start gap-4 rounded-md border p-3 dark:border-gray-800 transition ${
            dragging ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20" : ""
          }`}
        >
          {isImage ? (
            <img
              src={value}
              alt=""
              className="w-28 h-28 object-cover rounded-md border dark:border-gray-800"
            />
          ) : (
            <div className="w-28 h-28 rounded-md bg-muted flex items-center justify-center border dark:border-gray-800">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-2">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline break-all"
            >
              {value.split("/").pop()}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
            {uploading && <Progress value={progress} className="h-1.5" />}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
                disabled={uploading}
              >
                <X className="w-3.5 h-3.5 mr-1.5" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 cursor-pointer transition ${
            dragging
              ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
              : "hover:bg-muted/30 dark:border-gray-800"
          }`}
        >
          {isImage ? (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
          <p className="text-sm text-foreground">
            {uploading ? "Uploading…" : (
              <>
                <span className="font-medium">Click to upload</span>
                <span className="text-muted-foreground"> or drag &amp; drop</span>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {isImage ? "PNG, JPG, WEBP" : "PDF only"}
          </p>
          {uploading && <Progress value={progress} className="h-1.5 w-40" />}
          <input
            type="file"
            className="hidden"
            accept={defaultAccept}
            onChange={handleSelect}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
