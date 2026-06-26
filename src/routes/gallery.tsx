import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { galleryQuery } from "@/lib/queries";
import { resolveImage } from "@/lib/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Imadu Global Concepts" },
      { name: "description", content: "Finished installations, workshop moments, and a closer look at the chairs we build." },
      { property: "og:title", content: "Gallery — Imadu Global Concepts" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(galleryQuery);
  },
  component: GalleryPage,
});

function GalleryPage() {
  const images = useSuspenseQuery(galleryQuery).data;
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <SiteLayout>
      <section className="container-page pt-16 lg:pt-24 pb-12">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-charcoal max-w-3xl">
          A closer look.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Finished installations, moments from the workshop floor, and the
          chairs themselves — photographed without fuss.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightbox(resolveImage(img.url))}
              className="block w-full mb-6 break-inside-avoid overflow-hidden bg-stone group"
            >
              <img
                src={resolveImage(img.url)}
                alt={img.caption ?? "Gallery image"}
                loading={i < 3 ? "eager" : "lazy"}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {img.caption && (
                <div className="px-1 py-3 text-left">
                  <p className="text-sm text-charcoal/80">{img.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            <X className="size-6" />
          </button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[92vw] object-contain" />
        </div>
      )}
    </SiteLayout>
  );
}
