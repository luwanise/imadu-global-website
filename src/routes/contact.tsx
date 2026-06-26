import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Facebook, Instagram, Music2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { COMPANY, whatsappEnquiry } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Imadu Global Concepts" },
      { name: "description", content: "Get in touch with Imadu Global Concepts. Visit our workshop on the Sagamu–Abeokuta Express Way, or message us on WhatsApp." },
      { property: "og:title", content: "Contact — Imadu Global Concepts" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const subject = String(fd.get("subject") ?? "Enquiry");
    const message = String(fd.get("message") ?? "");
    const text = `Hello Imadu Global Concepts,\n\nMy name is ${name}.\nSubject: ${subject}\n\n${message}`;
    const url = `https://wa.me/2348034328344?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
    setSubmitting(false);
    toast.success("Opening WhatsApp with your message…");
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <SiteLayout>
      <section className="container-page pt-16 lg:pt-24 pb-16">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl text-charcoal max-w-3xl">
          Let's discuss your seating.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Tell us about your project — congregation size, classroom count, office
          floors, or just the chair you have in mind. We respond promptly.
        </p>
      </section>

      <section className="container-page pb-24 grid lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <p className="eyebrow">Workshop</p>
            <p className="mt-3 flex items-start gap-3 text-charcoal/85">
              <MapPin className="size-5 text-wine mt-0.5 shrink-0" />
              <span>{COMPANY.address}</span>
            </p>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <p className="mt-3 flex items-center gap-3 text-charcoal/85">
              <Phone className="size-5 text-wine shrink-0" />
              <a href={`tel:${COMPANY.phone}`} className="hover:text-wine">{COMPANY.phone}</a>
            </p>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <p className="mt-3 flex items-center gap-3 text-charcoal/85">
              <Mail className="size-5 text-wine shrink-0" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-wine break-all">{COMPANY.email}</a>
            </p>
          </div>
          <div>
            <p className="eyebrow">WhatsApp</p>
            <a
              href={whatsappEnquiry()}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-sm bg-wine px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-wine-deep transition-colors"
            >
              <MessageCircle className="size-4" /> Message us on WhatsApp
            </a>
          </div>
          <div>
            <p className="eyebrow">Follow</p>
            <div className="mt-3 flex items-center gap-4">
              <a href={COMPANY.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-charcoal/70 hover:text-wine">
                <Facebook className="size-5" />
              </a>
              <a href={COMPANY.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-charcoal/70 hover:text-wine">
                <Instagram className="size-5" />
              </a>
              <a href={COMPANY.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="text-charcoal/70 hover:text-wine">
                <Music2 className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={onSubmit} className="border border-border p-8 md:p-10 bg-background">
            <h2 className="font-display text-2xl text-charcoal">Send an enquiry</h2>
            <p className="text-sm text-muted-foreground mt-1">
              We'll open WhatsApp with your message ready to send.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              <Field name="name" label="Your name" required />
              <Field name="organization" label="Organization (optional)" />
            </div>
            <div className="mt-5">
              <Field name="subject" label="Subject" required />
            </div>
            <div className="mt-5">
              <label className="text-sm text-charcoal mb-2 block">Message</label>
              <textarea
                name="message"
                required
                rows={6}
                className="w-full border border-input rounded-sm bg-background px-4 py-3 text-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-wine px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-wine-deep disabled:opacity-60 transition-colors"
            >
              <MessageCircle className="size-4" />
              Send via WhatsApp
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="aspect-[16/7] w-full bg-stone">
          <iframe
            title="Imadu Global Concepts location"
            src="https://www.google.com/maps?q=Sagamu+Abeokuta+Expressway+Siun&output=embed"
            className="size-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm text-charcoal mb-2 block">{label}</label>
      <input
        name={name}
        required={required}
        className="w-full border border-input rounded-sm bg-background px-4 py-2.5 text-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine"
      />
    </div>
  );
}
