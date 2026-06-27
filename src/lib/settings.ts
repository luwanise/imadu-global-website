import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  logo_url: string;
  favicon_url: string;
};

export const siteSettingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");
    if (error) throw error;
    const map: Record<string, unknown> = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return {
      logo_url: typeof map.logo_url === "string" ? map.logo_url : "",
      favicon_url: typeof map.favicon_url === "string" ? map.favicon_url : "",
    };
  },
  staleTime: 60_000,
});

export async function saveSetting(key: keyof SiteSettings, value: string) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value: value as unknown as never }, { onConflict: "key" });
  if (error) throw error;
}
