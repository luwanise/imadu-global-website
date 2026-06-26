import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2, Phone, Mail, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-charcoal text-stone/85">
      <div className="container-page py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <span className="grid size-9 place-items-center rounded-sm bg-wine text-primary-foreground font-display text-lg leading-none">
                I
              </span>
              <span className="font-display text-xl text-white">Imadu Global Concepts</span>
            </div>
            <p className="text-sm leading-relaxed text-stone/70">
              A Nigerian chair manufacturer crafting seating for churches, classrooms,
              offices, homes, and events — with the care of a workshop and the
              reliability of a factory.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-white/70 mb-5">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/about", label: "About" },
                { to: "/products", label: "Products" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-stone/75 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-white/70 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 text-stone/75">
                <MapPin className="size-4 mt-0.5 shrink-0" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex gap-3 text-stone/75">
                <Phone className="size-4 mt-0.5 shrink-0" />
                <a href={`tel:${COMPANY.phone}`} className="hover:text-white">{COMPANY.phone}</a>
              </li>
              <li className="flex gap-3 text-stone/75">
                <Mail className="size-4 mt-0.5 shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white break-all">{COMPANY.email}</a>
              </li>
            </ul>

            <div className="flex items-center gap-4 mt-6">
              <a href={COMPANY.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-stone/70 hover:text-white">
                <Facebook className="size-4" />
              </a>
              <a href={COMPANY.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-stone/70 hover:text-white">
                <Instagram className="size-4" />
              </a>
              <a href={COMPANY.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="text-stone/70 hover:text-white">
                <Music2 className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-stone/55">
          <p>© {new Date().getFullYear()} Imadu Global Concepts. All rights reserved.</p>
          <Link to="/auth" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
