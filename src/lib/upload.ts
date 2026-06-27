import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

/**
 * Upload a file to the "uploads" bucket and return a long-lived URL
 * that can be embedded directly in <img> tags.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("uploads")
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (upErr) throw upErr;

  const { data, error } = await supabase.storage
    .from("uploads")
    .createSignedUrl(path, TEN_YEARS_SECONDS);
  if (error || !data?.signedUrl) throw error ?? new Error("Failed to sign URL");
  return data.signedUrl;
}
