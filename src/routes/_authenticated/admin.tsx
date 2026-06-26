import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  categoriesQuery,
  productsQuery,
  galleryQuery,
  testimonialsQuery,
  type Product,
} from "@/lib/queries";
import { resolveImage } from "@/lib/site";
import { Edit, Trash2, Plus, LogOut, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "products" | "gallery" | "testimonials";

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("products");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id;
      if (!uid) { setIsAdmin(false); return; }
      const { data: rows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin");
      setIsAdmin((rows?.length ?? 0) > 0);
    });
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) {
    return <SiteLayout><div className="container-page py-32 text-muted-foreground">Loading…</div></SiteLayout>;
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="container-page py-24 max-w-xl">
          <ShieldAlert className="size-6 text-wine" />
          <h1 className="mt-4 font-display text-3xl text-charcoal">Access pending</h1>
          <p className="mt-3 text-muted-foreground">
            Your account is signed in, but you don't have admin permissions yet.
            Ask the site owner to grant you the <code className="bg-stone px-1.5 py-0.5 text-xs">admin</code> role.
          </p>
          <button onClick={signOut} className="mt-8 inline-flex items-center gap-2 text-sm text-charcoal hover:text-wine">
            <LogOut className="size-4" /> Sign out
          </button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container-page py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-2 font-display text-4xl text-charcoal">Dashboard</h1>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-wine">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>

        <div className="border-b border-border flex gap-8 mb-10">
          {(["products","gallery","testimonials"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm capitalize -mb-px border-b-2 transition-colors ${
                tab === t ? "border-wine text-wine" : "border-transparent text-charcoal/70 hover:text-charcoal"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "products" && <ProductsAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "testimonials" && <TestimonialsAdmin />}
      </section>
    </SiteLayout>
  );
}

/* ---------------- Products ---------------- */

function ProductsAdmin() {
  const qc = useQueryClient();
  const products = useQuery(productsQuery);
  const categories = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-charcoal">Products</h2>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-sm bg-wine px-4 py-2 text-sm text-primary-foreground hover:bg-wine-deep"
        >
          <Plus className="size-4" /> New product
        </button>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone text-charcoal/70 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.data?.map((p) => {
              const cat = categories.data?.find((c) => c.id === p.category_id);
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={resolveImage(p.cover_image)} className="size-10 object-cover bg-stone" alt="" />
                    <div>
                      <div className="text-charcoal">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.slug}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/80">{cat?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal/80">{p.price_text ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-sm ${p.available ? "bg-stone text-charcoal" : "bg-stone text-muted-foreground"}`}>
                      {p.available ? "Available" : "Made to order"}
                    </span>
                    {p.featured && <span className="ml-2 text-xs px-2 py-1 rounded-sm bg-wine/10 text-wine">Featured</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(p)} className="inline-flex p-2 hover:text-wine" aria-label="Edit"><Edit className="size-4" /></button>
                    <button onClick={() => remove(p.id)} className="inline-flex p-2 hover:text-destructive" aria-label="Delete"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductForm
          product={editing}
          categories={categories.data ?? []}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { qc.invalidateQueries({ queryKey: ["products"] }); setEditing(null); setCreating(false); }}
        />
      )}
    </div>
  );
}

function ProductForm({
  product, categories, onClose, onSaved,
}: {
  product: Product | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    category_id: product?.category_id ?? "",
    description: product?.description ?? "",
    features: product?.features?.join("\n") ?? "",
    dimensions: product?.dimensions ?? "",
    price_text: product?.price_text ?? "",
    cover_image: product?.cover_image ?? "",
    available: product?.available ?? true,
    featured: product?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      category_id: form.category_id || null,
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const op = product
      ? supabase.from("products").update(payload).eq("id", product.id)
      : supabase.from("products").insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(product ? "Product updated" : "Product created");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-charcoal">{product ? "Edit product" : "New product"}</h3>
          <button onClick={onClose} aria-label="Close"><X className="size-5" /></button>
        </div>
        <div className="space-y-4">
          <Row label="Name"><Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} /></Row>
          <Row label="Slug (URL)"><Input value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="e.g. imperial-church-chair" /></Row>
          <Row label="Category">
            <select className={inputCls} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Row>
          <Row label="Cover image URL"><Input value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} placeholder="https://… or /assets/…" /></Row>
          <Row label="Price (display text)"><Input value={form.price_text} onChange={(v) => setForm({ ...form, price_text: v })} placeholder="Request a quote" /></Row>
          <Row label="Dimensions"><Input value={form.dimensions} onChange={(v) => setForm({ ...form, dimensions: v })} /></Row>
          <Row label="Description">
            <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Row>
          <Row label="Features (one per line)">
            <textarea rows={4} className={inputCls} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </Row>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured on homepage
            </label>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-charcoal hover:text-wine">Cancel</button>
          <button onClick={save} disabled={saving} className="rounded-sm bg-wine px-5 py-2.5 text-sm text-primary-foreground hover:bg-wine-deep disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-input rounded-sm bg-background px-3 py-2 text-sm focus:border-wine focus:outline-none focus:ring-1 focus:ring-wine";
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-charcoal mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

/* ---------------- Gallery ---------------- */

function GalleryAdmin() {
  const qc = useQueryClient();
  const gallery = useQuery(galleryQuery);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");

  async function add() {
    if (!url) return toast.error("Image URL required");
    const { error } = await supabase.from("gallery_images").insert({ url, caption: caption || null, category: category || null });
    if (error) return toast.error(error.message);
    toast.success("Image added");
    setUrl(""); setCaption(""); setCategory("");
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }
  async function remove(id: string) {
    if (!confirm("Remove this image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal mb-6">Gallery</h2>
      <div className="border border-border rounded-sm p-6 mb-8 grid sm:grid-cols-4 gap-3">
        <input className={inputCls + " sm:col-span-2"} placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input className={inputCls} placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="flex gap-3">
          <input className={inputCls} placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button onClick={add} className="rounded-sm bg-wine px-4 text-sm text-primary-foreground hover:bg-wine-deep">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.data?.map((g) => (
          <div key={g.id} className="relative group">
            <img src={resolveImage(g.url)} alt={g.caption ?? ""} className="aspect-square w-full object-cover bg-stone" />
            <button onClick={() => remove(g.id)} className="absolute top-2 right-2 bg-background/95 p-1.5 rounded-sm opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity">
              <Trash2 className="size-4" />
            </button>
            {g.caption && <p className="text-xs text-muted-foreground mt-2">{g.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Testimonials ---------------- */

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const list = useQuery(testimonialsQuery);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");

  async function add() {
    if (!author || !quote) return toast.error("Author and quote are required");
    const { error } = await supabase.from("testimonials").insert({ author, role: role || null, quote });
    if (error) return toast.error(error.message);
    setAuthor(""); setRole(""); setQuote("");
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal mb-6">Testimonials</h2>
      <div className="border border-border rounded-sm p-6 mb-8 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <input className={inputCls} placeholder="Role / organization" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <textarea rows={3} className={inputCls} placeholder="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} />
        <div className="flex justify-end">
          <button onClick={add} className="rounded-sm bg-wine px-4 py-2 text-sm text-primary-foreground hover:bg-wine-deep">Add testimonial</button>
        </div>
      </div>

      <div className="space-y-4">
        {list.data?.map((t) => (
          <div key={t.id} className="border border-border p-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-charcoal font-medium">{t.author}</div>
              {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
              <p className="mt-2 text-sm text-charcoal/85">"{t.quote}"</p>
            </div>
            <button onClick={() => remove(t.id)} className="p-2 hover:text-destructive"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
