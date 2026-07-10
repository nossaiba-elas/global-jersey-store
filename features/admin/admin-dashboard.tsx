"use client";

import { useState } from "react";
import {
  Pencil, Trash2, Package, Users, ShoppingCart,
  TrendingUp, DollarSign, Eye, Search, ChevronDown, ChevronUp,
  CheckCircle2, Truck, RefreshCw, Clock, BarChart3, Settings
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/format";
import { PRODUCTS } from "@/constants/products";
import { useOrdersStore, type Order, type OrderStatus } from "@/lib/store/orders-store";
import { useProductsStore } from "@/lib/store/products-store";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string; dot: string }> = {
  confirmed:  { label: "Confirmed",  className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50", dot: "bg-emerald-500" },
  processing: { label: "Processing", className: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",         dot: "bg-blue-500"    },
  shipped:    { label: "Shipped",    className: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",       dot: "bg-amber-500"   },
  delivered:  { label: "Delivered",  className: "text-primary bg-primary/10",                            dot: "bg-primary"     },
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color,
}: { icon: React.ElementType; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div className={cn("size-9 rounded-lg flex items-center justify-center", color)}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders = useOrdersStore((s) => s.orders);
  const products = useProductsStore((s) => s.products);
  const updateProductInStore = useProductsStore((s) => s.updateProduct);
  const deleteProductFromStore = useProductsStore((s) => s.deleteProduct);

  // ─── Computed stats ───────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(updated: Partial<Product>) {
    if (editing) {
      updateProductInStore(editing.id, updated);
      toast.success("Product updated.");
    }
    setOpen(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    deleteProductFromStore(id);
    toast.success("Product deleted.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your store, orders and products</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            Store Online
          </Badge>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign} label="Total Revenue" color="bg-emerald-500/10 text-emerald-600"
          value={formatPrice(totalRevenue)}
          sub={`${totalOrders} order${totalOrders !== 1 ? "s" : ""}`}
        />
        <StatCard
          icon={ShoppingCart} label="Total Orders" color="bg-blue-500/10 text-blue-600"
          value={String(totalOrders)}
          sub={totalOrders > 0 ? "Last order just now" : "No orders yet"}
        />
        <StatCard
          icon={Package} label="Products Listed" color="bg-primary/10 text-primary"
          value={String(products.length)}
          sub={`${outOfStock} out of stock`}
        />
        <StatCard
          icon={TrendingUp} label="Avg Order Value" color="bg-amber-500/10 text-amber-600"
          value={avgOrder > 0 ? formatPrice(avgOrder) : "—"}
          sub="per transaction"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders" className="gap-1.5">
            <ShoppingCart className="size-4" /> Orders
            {totalOrders > 0 && (
              <Badge className="ml-1 h-5 px-1.5 text-xs rounded-full">{totalOrders}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <Package className="size-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5">
            <BarChart3 className="size-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* ── ORDERS TAB ── */}
        <TabsContent value="orders">
          {orders.length === 0 ? (
            <div className="text-center py-20 border rounded-xl">
              <ShoppingCart className="mx-auto size-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-lg">No orders yet</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Orders placed on the site will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.confirmed;
                const isExpanded = expandedOrder === order.id;
                const totalItems = order.items.reduce((n, i) => n + i.quantity, 0);

                return (
                  <div key={order.id} className="rounded-xl border bg-card overflow-hidden">
                    {/* Row */}
                    <div className="p-4 flex flex-wrap items-center gap-4">
                      <div className="min-w-[140px]">
                        <p className="text-xs text-muted-foreground">Order</p>
                        <p className="font-mono font-bold text-primary text-sm">
                          {order.orderNumber ?? order.id}
                        </p>
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="text-sm font-medium truncate">{order.shipping.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{order.shipping.email}</p>
                      </div>
                      <div className="min-w-[80px]">
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="text-sm font-medium">{totalItems}</p>
                      </div>
                      <div className="min-w-[90px]">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                          status.className
                        )}>
                          <span className={cn("size-1.5 rounded-full", status.dot)} />
                          {status.label}
                        </span>
                      </div>
                      <div className="ml-auto">
                        <p className="text-xs text-muted-foreground mb-1">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs h-8"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <Eye className="size-3.5" />
                          {isExpanded ? "Hide" : "Details"}
                          {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <>
                        <Separator />
                        <div className="p-4 bg-muted/30 space-y-4">
                          {/* Items */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Items Ordered</p>
                            <div className="space-y-2">
                              {order.items.map((item) => {
                                const product = products.find((p) => p.id === item.productId);
                                return (
                                  <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between text-sm bg-card rounded-lg px-3 py-2">
                                    <div>
                                      <p className="font-medium">{product?.name ?? item.productId}</p>
                                      <p className="text-xs text-muted-foreground">Size: {item.size} · Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">{formatPrice((product?.price ?? 0) * item.quantity)}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            {/* Price breakdown */}
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Price Breakdown</p>
                              <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(order.tax)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span></div>
                                <Separator className="my-1" />
                                <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                              </div>
                            </div>

                            {/* Shipping address */}
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Shipping Address</p>
                              <div className="text-sm space-y-0.5 text-muted-foreground">
                                <p className="text-foreground font-medium">{order.shipping.fullName}</p>
                                <p>{order.shipping.address}</p>
                                <p>{order.shipping.city}, {order.shipping.postalCode}</p>
                                <p>{order.shipping.country}</p>
                                <p className="mt-1">{order.shipping.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── PRODUCTS TAB ── */}
        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <ProductFormDialog editing={editing} onSave={handleSave} />
            </Dialog>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Product</th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Brand</th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Price</th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          defaultValue={p.stock}
                          className="h-8 w-20 text-center"
                          onBlur={(e) =>
                            updateProductInStore(p.id, { stock: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        {p.stock === 0 ? (
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        ) : p.stock < 5 ? (
                          <Badge className="text-xs bg-amber-500 text-white hover:bg-amber-500">Low Stock</Badge>
                        ) : (
                          <Badge className="text-xs bg-emerald-500 text-white hover:bg-emerald-500">In Stock</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => { setEditing(p); setOpen(true); }}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </TabsContent>

        {/* ── ANALYTICS TAB ── */}
        <TabsContent value="analytics">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="size-4 text-primary" /> Order Status Breakdown</h3>
              {(["confirmed","processing","shipped","delivered"] as OrderStatus[]).map((s) => {
                const count = orders.filter((o) => o.status === s).length;
                const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                const cfg = STATUS_CONFIG[s];
                return (
                  <div key={s} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground capitalize">{cfg.label}</span>
                      <span className="font-medium">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full", cfg.dot)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {totalOrders === 0 && <p className="text-muted-foreground text-sm">No orders yet.</p>}
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Package className="size-4 text-primary" /> Inventory Status</h3>
              {[
                { label: "In Stock", count: products.filter(p => p.stock >= 5).length, color: "bg-emerald-500" },
                { label: "Low Stock", count: products.filter(p => p.stock > 0 && p.stock < 5).length, color: "bg-amber-500" },
                { label: "Out of Stock", count: outOfStock, color: "bg-destructive" },
              ].map(({ label, count, color }) => {
                const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                return (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Product form dialog ──────────────────────────────────────────────────────
function ProductFormDialog({ editing, onSave }: { editing: Product | null; onSave: (data: Partial<Product>) => void }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const imageUrl = String(form.get("imageUrl") || "");
        onSave({
          name: String(form.get("name") || editing?.name),
          brand: String(form.get("brand") || editing?.brand),
          country: String(form.get("country") || editing?.country),
          price: Number(form.get("price") || editing?.price),
          stock: Number(form.get("stock") || editing?.stock),
          images: imageUrl ? [imageUrl] : (editing?.images ?? []),
        });
      }}>
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={editing?.name} className="mt-1.5" required placeholder="e.g. Morocco Home Jersey 2024" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" defaultValue={editing?.brand} className="mt-1.5" required placeholder="Nike, Adidas..." />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={editing?.country} className="mt-1.5" required placeholder="Morocco" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={editing?.price} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" defaultValue={editing?.stock ?? 50} className="mt-1.5" required />
          </div>
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={editing?.images?.[0] ?? ""}
            className="mt-1.5"
            placeholder="https://example.com/jersey.jpg"
          />
          {editing?.images?.[0] && (
            <img
              src={editing.images[0]}
              alt="Preview"
              className="mt-2 h-20 w-20 object-cover rounded-lg border"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <p className="text-xs text-muted-foreground mt-1">Paste a direct image link (jpg, png, webp)</p>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">{editing ? "Save Changes" : "Create Product"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
