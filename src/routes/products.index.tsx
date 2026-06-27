import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/queries";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Imadu Global Concepts" },
      {
        name: "description",
        content:
          "Browse our catalogue of church, classroom, office, home, lounge, and event chairs.",
      },
      { property: "og:title", content: "Products — Imadu Global Concepts" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
    ]);
  },
  component: ProductsPage,
});

function ProductsPage() {
  const products = useSuspenseQuery(productsQuery).data;
  const categories = useSuspenseQuery(categoriesQuery).data;
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? products.filter((p) => p.category_id === active) : products),
    [active, products],
  );

  return (
    <SiteLayout>
      <section className="container-page pt-16 lg:pt-24 pb-12">
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-charcoal max-w-3xl">
          Our chairs.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          A working catalogue of the chairs we build. Every piece is available
          to order — tap "I'm interested" to discuss quantities, finishes, and
          custom branding on WhatsApp.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="border-y border-border flex flex-wrap items-center gap-x-8 gap-y-3 py-5 mb-14">
          <button
            onClick={() => setActive(null)}
            className={`text-sm transition-colors ${active === null ? "text-wine" : "text-charcoal/70 hover:text-charcoal"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`text-sm transition-colors ${active === c.id ? "text-wine" : "text-charcoal/70 hover:text-charcoal"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
