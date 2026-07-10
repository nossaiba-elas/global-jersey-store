"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { CheckCircle2, ShoppingBag, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrdersStore, type ShippingInfo } from "@/lib/store/orders-store";
import { auth } from "@/lib/firebase";
import { useProductsStore } from "@/lib/store/products-store";
import { TEAMS } from "@/constants/teams";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 9.99;

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(4, "Enter your address"),
  city: z.string().min(1, "Enter your city"),
  postalCode: z.string().min(2, "Enter a postal code"),
  country: z.string().min(2, "Enter your country"),
});

function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 5 + Math.floor(Math.random() * 4));
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function CheckoutContent() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const allProducts = useProductsStore((s) => s.products);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const nextOrderNumber = useOrdersStore((s) => s.nextOrderNumber);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; number: string; delivery: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u?.email) {
        setValue("email", u.email);
        if (u.displayName) setValue("fullName", u.displayName);
      }
    });
    return unsub;
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingInfo>({ resolver: zodResolver(schema) });

  const lines = items
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) return null;
      const team = TEAMS.find((t) => t.countryCode === product.countryCode);
      return { item, product, team };
    })
    .filter(Boolean) as {
    item: (typeof items)[number];
    product: NonNullable<ReturnType<typeof allProducts.find>>;
    team: (typeof TEAMS)[number] | undefined;
  }[];

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shippingCost;

  function onSubmit(values: ShippingInfo) {
    setSubmitting(true);
    setTimeout(() => {
      const orderNumber = nextOrderNumber();
      const id = `ord_${Math.random().toString(36).slice(2, 10)}`;
      const delivery = getEstimatedDelivery();
      addOrder({
        id,
        orderNumber,
        createdAt: new Date().toISOString(),
        items,
        shipping: values,
        subtotal,
        tax,
        shippingCost,
        total,
        status: "confirmed",
        estimatedDelivery: delivery,
      });
      clearCart();
      setPlacedOrder({ id, number: orderNumber, delivery });
      setSubmitting(false);
    }, 900);
  }

  // ─── Order confirmed screen ───────────────────────────────────────────────
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="flex items-center justify-center size-20 mx-auto rounded-full bg-primary/10 mb-6">
          <CheckCircle2 className="size-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Thank you! Your order has been received and is being processed.
        </p>

        <div className="mt-8 rounded-xl border bg-card p-6 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Order Number</span>
            <span className="font-mono font-bold text-primary text-base">{placedOrder.number}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
              Confirmed
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Estimated Delivery</span>
            <span className="text-sm font-medium">{placedOrder.delivery}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Paid</span>
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <Button render={<Link href="/profile" />} className="gap-2">
            <Package className="size-4" /> View My Orders
          </Button>
          <Button variant="outline" render={<Link href="/shop" />} className="gap-2">
            Continue Shopping <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── Empty cart ───────────────────────────────────────────────────────────
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Add some jerseys before checking out.</p>
        <Button render={<Link href="/shop" />} className="mt-6">
          Start Shopping
        </Button>
      </div>
    );
  }

  // ─── Checkout form ────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" className="mt-1.5" {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-1.5" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" className="mt-1.5" {...register("address")} />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5" {...register("city")} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" className="mt-1.5" {...register("postalCode")} />
                {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" className="mt-1.5" {...register("country")} />
                {errors.country && <p className="text-xs text-destructive mt-1">{errors.country.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="font-semibold mb-1">Payment</h2>
            <p className="text-xs text-muted-foreground mb-4">Demo checkout — no real payment is processed.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Card Number</Label>
                <Input className="mt-1.5" placeholder="4242 4242 4242 4242" disabled />
              </div>
              <div>
                <Label>Expiry</Label>
                <Input className="mt-1.5" placeholder="12/28" disabled />
              </div>
              <div>
                <Label>CVC</Label>
                <Input className="mt-1.5" placeholder="123" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="rounded-xl border p-6 h-fit sticky top-24 space-y-4">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {lines.map(({ item, product, team }) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                <div className="size-14 shrink-0 rounded-lg bg-muted flex items-center justify-center p-1.5">
                  <ProductImage
                    src={team?.jerseyImage}
                    primaryColor={team?.primaryColor ?? "#111"}
                    secondaryColor={team?.secondaryColor ?? "#999"}
                    flag={team?.flag ?? ""}
                    alt={product.name}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium leading-tight">{product.name}</p>
                  <p className="text-muted-foreground text-xs">Size {item.size} × {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Placing Order…" : `Place Order · ${formatPrice(total)}`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Free shipping on orders over $75
          </p>
        </div>
      </form>
    </div>
  );
}
