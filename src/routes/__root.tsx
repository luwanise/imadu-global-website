import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl text-charcoal">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-wine px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-wine-deep transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    // If you want remote error tracking, integrate Sentry/LogRocket/etc. here.
    console.error("Captured route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-charcoal">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-sm bg-wine px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-wine-deep"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-5 py-2.5 text-sm text-charcoal hover:bg-stone"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Imadu Global Concepts — Premium Chair Manufacturers, Nigeria" },
      {
        name: "description",
        content:
          "Imadu Global Concepts manufactures premium chairs for churches, classrooms, offices, homes, and events across Nigeria.",
      },
      { property: "og:site_name", content: "Imadu Global Concepts" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Imadu Global Concepts — Premium Chair Manufacturers, Nigeria" },
      { name: "twitter:title", content: "Imadu Global Concepts — Premium Chair Manufacturers, Nigeria" },
      { name: "description", content: "A modern, responsive website showcasing Imadu Global Concepts' premium chair manufacturing and branding services." },
      { property: "og:description", content: "A modern, responsive website showcasing Imadu Global Concepts' premium chair manufacturing and branding services." },
      { name: "twitter:description", content: "A modern, responsive website showcasing Imadu Global Concepts' premium chair manufacturing and branding services." },
      { property: "og:image", content: "https://via.placeholder.com/1200x630.png?text=Imadu+Global+Concepts" },
      { name: "twitter:image", content: "https://via.placeholder.com/1200x630.png?text=Imadu+Global+Concepts" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  // Apply dynamic favicon from site_settings
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "favicon_url")
      .maybeSingle()
      .then(({ data }) => {
        const url = typeof data?.value === "string" ? data.value : "";
        if (cancelled || !url) return;
        let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = url;
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
