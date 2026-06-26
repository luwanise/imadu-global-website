import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import workshop from "@/assets/workshop.jpg";
import hero from "@/assets/hero-chair.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Imadu Global Concepts" },
      {
        name: "description",
        content:
          "Our story, mission, and the craftsmanship behind every chair we make at Imadu Global Concepts.",
      },
      { property: "og:title", content: "About — Imadu Global Concepts" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="container-page pt-16 lg:pt-24 pb-16">
        <p className="eyebrow">About Us</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-charcoal max-w-3xl leading-[1.05]">
          A chair, made with conviction, quietly elevates the room it serves.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Imadu Global Concepts is a Nigerian chair manufacturer founded on the
          belief that comfort, durability, and good design belong to everyone —
          not just to the few.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="aspect-[16/8] overflow-hidden bg-stone">
          <img src={hero} alt="Imadu signature chair" className="size-full object-cover" />
        </div>
      </section>

      <section className="bg-stone border-y border-border">
        <div className="container-page py-24 grid md:grid-cols-3 gap-12">
          {[
            { icon: Compass, label: "Mission", title: "Quietly excellent seating, made well.",
              body: "To manufacture seating that is comfortable, durable, and beautifully resolved — produced responsibly and delivered on time." },
            { icon: Sparkles, label: "Vision", title: "West Africa's most respected name in seating.",
              body: "Recognised for craftsmanship, reliability, and service — chair by chair, customer by customer." },
            { icon: Heart, label: "Values", title: "Care in every joint.",
              body: "Honesty with customers, dignity for our craftsmen, and an unwillingness to cut corners — even when no one is looking." },
          ].map(({ icon: Icon, label, title, body }) => (
            <div key={label}>
              <Icon className="size-5 text-wine" />
              <p className="eyebrow mt-4">{label}</p>
              <h3 className="mt-2 font-display text-2xl text-charcoal">{title}</h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-stone">
            <img src={workshop} alt="Inside the workshop" className="size-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-charcoal">
              From one workshop to a trusted national supplier.
            </h2>
            <div className="mt-7 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Founded with a single workshop and a clear conviction — that a
                well-made chair quietly elevates the room it serves — Imadu has
                grown into one of Nigeria's trusted chair manufacturers.
              </p>
              <p>
                We supply churches, schools, businesses, hotels, and homes
                across the country, combining craftsmanship with the discipline
                of modern production.
              </p>
              <p>
                Today, our workshop on the Sagamu–Abeokuta Express Way ships
                seating nationwide — but the standard is the same as the day we
                made our first chair.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="container-page py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-stone/60">The Process</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-white max-w-2xl">
            Four stages, one standard.
          </h2>
          <div className="mt-14 grid md:grid-cols-4 gap-10">
            {[
              { n: "01", t: "Design", b: "Each model begins with proportion, posture, and purpose — refined before a single cut is made." },
              { n: "02", t: "Fabrication", b: "Frames are welded or joined in our workshop, with materials selected for the chair's intended life." },
              { n: "03", t: "Upholstery & finish", b: "Hand-stitched upholstery, hand-finished surfaces. The details you feel before you see." },
              { n: "04", t: "Quality control", b: "Every chair is inspected against a written standard before it joins the delivery." },
            ].map((s) => (
              <div key={s.n} className="border-t border-white/15 pt-6">
                <div className="text-xs tracking-[0.22em] text-stone/55">{s.n}</div>
                <h3 className="mt-3 font-display text-2xl text-white">{s.t}</h3>
                <p className="mt-3 text-sm text-stone/70 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid md:grid-cols-2 gap-12 items-center">
          <div>
            <ShieldCheck className="size-5 text-wine" />
            <h2 className="mt-4 font-display text-4xl text-charcoal">
              Quality assurance, written down.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
              We check every chair against the same written specification —
              frame integrity, upholstery tension, finish quality. If a chair
              wouldn't meet the standard of one we'd buy ourselves, it doesn't
              ship.
            </p>
          </div>
          <div className="md:justify-self-end">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-sm bg-wine px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-wine-deep transition-colors"
            >
              Work with us <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
