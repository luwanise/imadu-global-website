import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Hammer, ShieldCheck, Truck, Award, MessageCircle, Quote } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import {
  categoriesQuery,
  featuredProductsQuery,
  testimonialsQuery,
} from "@/lib/queries";
import { resolveImage, whatsappEnquiry } from "@/lib/site";
import heroChair from "@/assets/hero-chair.jpg";
import workshop from "@/assets/workshop.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imadu Global Concepts — Premium Chair Manufacturers, Nigeria" },
      {
        name: "description",
        content:
          "Manufacturers of refined seating for churches, classrooms, offices, homes, and events. Custom branding and bulk supply across Nigeria.",
      },
      { property: "og:title", content: "Imadu Global Concepts" },
      {
        property: "og:description",
        content: "Chairs built to be lived in, worshipped in, worked in.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(featuredProductsQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  const categories = useSuspenseQuery(categoriesQuery).data;
  const featured = useSuspenseQuery(featuredProductsQuery).data;
  const testimonials = useSuspenseQuery(testimonialsQuery).data;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div className="container-page pt-12 lg:pt-20 pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow">Chair Manufacturers — Nigeria</p>
              <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-charcoal">
                Chairs built to be lived in, worshipped in, worked in.
              </h1>
              <p className="mt-7 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Imadu Global Concepts crafts considered seating for churches,
                classrooms, offices, and homes — finished with the care of a
                workshop and the reliability of a factory.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-sm bg-wine px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-wine-deep transition-colors"
                >
                  Explore the catalogue
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappEnquiry()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-wine"
                >
                  <MessageCircle className="size-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[5/6] overflow-hidden bg-stone">
                <img
                  src={heroChair}
                  alt="A wine-coloured velvet chair in a sunlit showroom"
                  width={1600}
                  height={1100}
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="border-t border-border bg-stone">
        <div className="container-page py-20">
          <div className="flex items-end justify-between gap-8 mb-12">
            <div>
              <p className="eyebrow">Collections</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-charcoal">
                Seating for every setting.
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-2 text-sm text-charcoal hover:text-wine"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to="/products"
                className="group relative aspect-[4/5] overflow-hidden bg-background"
              >
                <img
                  src={resolveImage(coverFor(c.slug))}
                  alt={c.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                <div className="absolute left-6 bottom-6 right-6">
                  <h3 className="font-display text-2xl text-white">{c.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-pad">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow">Why Imadu</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-charcoal">
              Workshop standards. Factory reliability.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
              Every chair leaves our line graded against the same standard — a
              chair our own family would sit on. From church auditoriums to
              boardrooms, we deliver seating that lasts.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: Hammer, title: "Built to last", body: "Reinforced frames and hand-finished joinery — chairs that endure decades of daily use." },
              { icon: ShieldCheck, title: "Quality assured", body: "Every batch is inspected against a written standard before it leaves the workshop." },
              { icon: Award, title: "Custom branding", body: "We print your church, school, or company logo cleanly onto the chair." },
              { icon: Truck, title: "Bulk supply", body: "Reliable nationwide delivery for orders of any scale, on the schedule we promise." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-border pt-6">
                <Icon className="size-5 text-wine" />
                <h3 className="mt-4 font-display text-xl text-charcoal">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing quality */}
      <section className="bg-charcoal text-white">
        <div className="container-page py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div className="aspect-[5/4] overflow-hidden">
            <img
              src={workshop}
              alt="Inside the Imadu workshop"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-stone/60">Manufacturing</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">
              Made deliberately, in our own workshop.
            </h2>
            <p className="mt-6 text-stone/75 leading-relaxed max-w-lg">
              We control every step — from frame welding and upholstery to
              finishing and quality control. It's how we keep our standards
              tight and our timelines honest.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm text-white border-b border-white/30 pb-1 hover:border-white"
            >
              Inside our process <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section-pad">
        <div className="container-page">
          <div className="flex items-end justify-between gap-8 mb-14">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-charcoal">
                Selected pieces from the catalogue.
              </h2>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-sm text-charcoal hover:text-wine">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Custom branding CTA */}
      <section className="bg-stone border-y border-border">
        <div className="container-page py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">Custom Branding</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-charcoal">
              Your logo, printed with precision.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
              From church congregations to hotel groups, we brand chairs cleanly
              with your logo — a quiet mark of belonging on every seat.
            </p>
          </div>
          <div className="flex md:justify-end">
            <a
              href={whatsappEnquiry()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-wine px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-wine-deep transition-colors"
            >
              <MessageCircle className="size-4" />
              Discuss your project
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad">
        <div className="container-page">
          <p className="eyebrow text-center">Trusted across Nigeria</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-charcoal text-center max-w-3xl mx-auto">
            What our customers say.
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-10">
            {testimonials.map((t) => (
              <figure key={t.id} className="border-t border-border pt-8">
                <Quote className="size-5 text-wine" />
                <blockquote className="mt-5 text-charcoal leading-relaxed">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <div className="font-medium text-charcoal">{t.author}</div>
                  {t.role && <div className="text-muted-foreground">{t.role}</div>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function coverFor(slug: string): string {
  switch (slug) {
    case "church": return "/assets/cat-church.jpg";
    case "classroom": return "/assets/cat-classroom.jpg";
    case "office": return "/assets/cat-office.jpg";
    case "home": return "/assets/cat-lounge.jpg";
    case "lounge": return "/assets/cat-lounge.jpg";
    case "event": return "/assets/cat-event.jpg";
    default: return "/assets/hero-chair.jpg";
  }
}
