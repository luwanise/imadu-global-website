import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { resolveImage, whatsappEnquiry } from "@/lib/site";
import type { Product } from "@/lib/queries";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/5] overflow-hidden bg-stone"
      >
        <img
          src={resolveImage(product.cover_image)}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {!product.available && (
          <span className="absolute top-3 left-3 bg-background/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-charcoal">
            Made to order
          </span>
        )}
      </Link>

      <div className="pt-5 flex items-start justify-between gap-4">
        <div>
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="font-display text-xl text-charcoal hover:text-wine transition-colors"
          >
            {product.name}
          </Link>
          {product.price_text && (
            <p className="text-sm text-muted-foreground mt-1">{product.price_text}</p>
          )}
        </div>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          aria-label={`View ${product.name}`}
          className="shrink-0 grid place-items-center size-9 rounded-full border border-border text-charcoal hover:bg-wine hover:text-primary-foreground hover:border-wine transition-colors"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="text-sm text-charcoal underline-offset-4 hover:underline"
        >
          View details
        </Link>
        <span className="text-border">/</span>
        <a
          href={whatsappEnquiry(product.name)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-wine hover:text-wine-deep"
        >
          <MessageCircle className="size-4" />
          I'm interested
        </a>
      </div>
    </article>
  );
}
