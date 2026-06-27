import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { resolveImage } from "@/lib/site";
import { toast } from "sonner";

export function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-[4/5]",
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please pick an image");
    setBusy(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      {label && <label className="text-sm text-charcoal mb-1.5 block">{label}</label>}
      <div className={`relative ${aspect} w-full max-w-xs border border-dashed border-input rounded-sm bg-stone overflow-hidden`}>
        {value ? (
          <>
            <img src={resolveImage(value)} className="size-full object-cover" alt="" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 bg-background/95 p-1.5 rounded-sm hover:text-destructive"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-charcoal"
          >
            {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            <span>{busy ? "Uploading…" : "Click to upload"}</span>
          </button>
        )}
        {value && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="absolute bottom-2 right-2 bg-background/95 px-2.5 py-1 rounded-sm text-xs hover:text-wine inline-flex items-center gap-1.5"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            Replace
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </div>
  );
}
