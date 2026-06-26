import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur border-b border-border" : "bg-background"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-sm bg-wine text-primary-foreground font-display text-lg leading-none">
            I
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg text-charcoal">Imadu Global</span>
            <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
              Concepts
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-charcoal/80 hover:text-wine transition-colors"
              activeProps={{ className: "text-wine" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <Link
            to="/contact"
            className="inline-flex items-center text-sm font-medium text-primary-foreground bg-wine hover:bg-wine-deep transition-colors px-5 py-2.5 rounded-sm"
          >
            Request a Quote
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-charcoal"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-page py-6 flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-base text-charcoal hover:text-wine"
                activeProps={{ className: "text-wine" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center text-sm font-medium text-primary-foreground bg-wine px-5 py-3 rounded-sm w-fit"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
