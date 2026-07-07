"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrdersStore, generateOrderId, type ShippingInfo } from "@/lib/store/orders-store";
import { auth } from "@/lib/firebase";
import { PRODUCTS } from "@/constants/products";
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

export function CheckoutContent() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
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
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      const team = TEAMS.find((t) => t.countryCode === product.countryCode);
      return { item, product, team };
    })
    .filter(Boolean) as {
    item: (typeof items)[number];
    product: (typeof PRODUCTS)[number];
    team: (typeof TEAMS)[number] | undefined;
  }[];

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shippingCost;

  function onSubmit(values: ShippingInfo) {
    setSubmitting(true);
    setTimeout(() => {
      const orderId = generateOrderId();
      addOrder({
        id: orderId,
        createdAt: new Date().toISOString(),
        items,
        shipping: values,
        subtotal,
        tax,
        shippingCost,
        total,
        status: "confirmed",
      });
      clearCart();
      setPlacedOrderId(orderId);
      setSubmitting(false);
    }, 900);
  }

  if (placedOrderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h1 className="text-2xl font-bold mt-4">Order confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Your order <span className="font-mono font-medium text-foreground">{placedOrderId}</span> has
          been placed. A confirmation was sent to your email.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button render={<Link href="/shop" />}>Continue Shopping</Button>
          <Button variant="outline" render={<Link href="/profile" />}>
            View Orders
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" className="mt-1.5" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-1.5" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" className="mt-1.5" {...register("address")} />
                {errors.address && (
                  <p className="text-xs text-destructive mt-1">{errors.address.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5" {...register("city")} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" className="mt-1.5" {...register("postalCode")} />
                {errors.postalCode && (
                  <p className="text-xs text-destructive mt-1">{errors.postalCode.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" className="mt-1.5" {...register("country")} />
                {errors.country && (
                  <p className="text-xs text-destructive mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="font-semibold mb-1">Payment</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Demo checkout — no real payment is processed.
            </p>
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

        <div className="rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">Order Summary</h2>
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
                  <p className="text-muted-foreground text-xs">
                    Size {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
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
          <Separator className="my-4" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button type="submit" className="w-full mt-6" size="lg" disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
