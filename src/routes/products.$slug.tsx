import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { productBySlugQuery, productsQuery, categoriesQuery } from "@/lib/queries";
import { resolveImage, whatsappEnquiry } from "@/lib/site";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Imadu Global Concepts` },
      { property: "og:url", content: `/products/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/products/${params.slug}` }],
  }),
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productBySlugQuery(params.slug));
    if (!product) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
    ]);
  },
  component: ProductDetailPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-32 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-3 font-display text-4xl text-charcoal">This product doesn't exist.</h1>
        <Link to="/products" className="inline-flex items-center gap-2 mt-8 text-sm text-wine">
          <ArrowLeft className="size-4" /> Back to catalogue
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = useSuspenseQuery(productBySlugQuery(slug)).data!;
  const all = useSuspenseQuery(productsQuery).data;
  const categories = useSuspenseQuery(categoriesQuery).data;
  const category = categories.find((c) => c.id === product.category_id);

  const related = all.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 3);

  return (
    <SiteLayout>
      <section className="container-page pt-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-charcoal">
          <ArrowLeft className="size-4" /> Back to catalogue
        </Link>
      </section>

      <section className="container-page py-12 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="aspect-[4/5] overflow-hidden bg-stone">
          <img
            src={resolveImage(product.cover_image)}
            alt={product.name}
            className="size-full object-cover"
          />
        </div>

        <div>
          {category && <p className="eyebrow">{category.name}</p>}
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-charcoal">{product.name}</h1>
          {product.price_text && (
            <p className="mt-4 text-lg text-muted-foreground">{product.price_text}</p>
          )}

          {product.description && (
            <p className="mt-8 text-charcoal/85 leading-relaxed">{product.description}</p>
          )}

          {product.features?.length > 0 && (
            <div className="mt-10">
              <p className="eyebrow">Features</p>
              <ul className="mt-4 space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-charcoal/85">
                    <Check className="size-4 text-wine mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.dimensions && (
            <div className="mt-10 border-t border-border pt-6">
              <p className="eyebrow">Dimensions</p>
              <p className="mt-2 text-sm text-charcoal/85">{product.dimensions}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={whatsappEnquiry(product.name)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-wine px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-wine-deep transition-colors"
            >
              <MessageCircle className="size-4" />
              I'm interested
            </a>
            <span className="text-sm text-muted-foreground">
              {product.available ? "In production — quick turnaround" : "Made to order"}
            </span>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad border-t border-border">
          <div className="container-page">
            <p className="eyebrow">You may also like</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-charcoal">Related pieces</h2>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
