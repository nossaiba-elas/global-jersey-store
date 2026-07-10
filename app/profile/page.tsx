"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  LogOut, Package, Heart, UserCircle, ChevronDown, ChevronUp,
  Truck, CheckCircle2, Clock, RefreshCw, MapPin, Mail, Calendar
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/firebase";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useOrdersStore, type Order } from "@/lib/store/orders-store";
import { PRODUCTS } from "@/constants/products";
import { TEAMS } from "@/constants/teams";
import { ProductCard } from "@/components/shared/product-card";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    dot: "bg-emerald-500",
  },
  processing: {
    label: "Processing",
    icon: RefreshCw,
    className: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    dot: "bg-amber-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "text-primary bg-primary/10",
    dot: "bg-primary",
  },
};

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.confirmed;
  const StatusIcon = status.icon;

  const lines = order.items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      const team = TEAMS.find((t) => t.countryCode === product.countryCode);
      return { item, product, team };
    })
    .filter(Boolean) as { item: (typeof order.items)[number]; product: (typeof PRODUCTS)[number]; team: (typeof TEAMS)[number] | undefined }[];

  const totalItems = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
              Order Number
            </p>
            <p className="font-mono font-bold text-lg text-primary">
              {order.orderNumber ?? order.id}
            </p>
          </div>
          <span className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full",
            status.className
          )}>
            <span className={cn("size-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="size-3.5" />
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </span>
          {order.estimatedDelivery && (
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5" />
              Est. {order.estimatedDelivery}
            </span>
          )}
        </div>

        {/* Total + expand button */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">{formatPrice(order.total)}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="gap-2 text-sm"
          >
            {expanded ? (
              <><ChevronUp className="size-4" /> Hide Details</>
            ) : (
              <><ChevronDown className="size-4" /> View Details</>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <>
          <Separator />
          <div className="p-5 space-y-6">
            {/* Items */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Items Ordered</h4>
              <div className="space-y-3">
                {lines.map(({ item, product, team }) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/40"
                  >
                    <div className="size-16 shrink-0 rounded-lg bg-muted flex items-center justify-center p-2">
                      <ProductImage
                        src={team?.jerseyImage}
                        primaryColor={team?.primaryColor ?? "#111"}
                        secondaryColor={team?.secondaryColor ?? "#999"}
                        flag={team?.flag ?? ""}
                        alt={product.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Size: <span className="font-medium">{item.size}</span>
                        {" · "}Qty: <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">{formatPrice(product.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">{formatPrice(product.price)} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown + Shipping info */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Shipping Address</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1.5 text-foreground font-medium">
                    <MapPin className="size-3.5 shrink-0" />
                    {order.shipping.fullName}
                  </p>
                  <p className="ml-5">{order.shipping.address}</p>
                  <p className="ml-5">{order.shipping.city}, {order.shipping.postalCode}</p>
                  <p className="ml-5">{order.shipping.country}</p>
                  <p className="flex items-center gap-1.5 mt-2">
                    <Mail className="size-3.5 shrink-0" />
                    {order.shipping.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const productIds = useWishlistStore((s) => s.productIds);
  const wishlist = PRODUCTS.filter((p) => productIds.includes(p.id));
  const orders = useOrdersStore((s) => s.orders);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoaded(true);
    });
    return unsub;
  }, []);

  if (!loaded) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <UserCircle className="mx-auto size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">You&apos;re not signed in</h1>
        <p className="text-muted-foreground mt-2">Sign in to view your profile and orders.</p>
        <Button render={<Link href="/login" />} className="mt-6">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.displayName || "My Account"}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => signOut(auth)} className="gap-2">
          <LogOut className="size-4" /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders" className="gap-1.5">
            <Package className="size-4" /> Orders
            {orders.length > 0 && (
              <Badge className="ml-1 size-5 flex items-center justify-center p-0 text-xs rounded-full">
                {orders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-1.5">
            <Heart className="size-4" /> Wishlist
          </TabsTrigger>
        </TabsList>

        {/* Orders tab */}
        <TabsContent value="orders" className="pt-8">
          {orders.length === 0 ? (
            <div className="text-center py-16 border rounded-xl">
              <Package className="mx-auto size-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-lg">No orders yet</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-5">Your order history will appear here.</p>
              <Button render={<Link href="/shop" />}>Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wishlist tab */}
        <TabsContent value="wishlist" className="pt-8">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 border rounded-xl">
              <Heart className="mx-auto size-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-lg">Your wishlist is empty</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-5">Save jerseys to find them later.</p>
              <Button render={<Link href="/shop" />}>Browse Jerseys</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
