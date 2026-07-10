"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";
import { useProductsStore } from "@/lib/store/products-store";
import { TEAMS } from "@/constants/teams";

const TAX_RATE = 0.08;

export function CartContent() {
  const products = useProductsStore((s) => s.products);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const team = TEAMS.find((t) => t.countryCode === product.countryCode);
      return { item, product, team };
    })
    .filter(Boolean) as { item: (typeof items)[number]; product: NonNullable<ReturnType<typeof products.find>>; team: (typeof TEAMS)[number] | undefined }[];

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Looks like you haven&apos;t added any jerseys yet.</p>
        <Button render={<Link href="/shop" />} className="mt-6">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-4">
          {lines.map(({ item, product, team }) => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 rounded-xl border p-4">
              <div className="size-20 shrink-0 rounded-lg bg-muted flex items-center justify-center p-2">
                <ProductImage
                  src={team?.jerseyImage}
                  primaryColor={team?.primaryColor ?? "#111"}
                  secondaryColor={team?.secondaryColor ?? "#999"}
                  flag={team?.flag ?? ""}
                  alt={product.name}
                  className="h-full w-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    aria-label="Remove item"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <span className="font-medium">{formatPrice(product.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">Order Summary</h2>
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
              <span>{subtotal > 75 ? "Free" : formatPrice(9.99)}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatPrice(subtotal > 75 ? total : total + 9.99)}</span>
          </div>
          <Button render={<Link href="/checkout" />} className="w-full mt-6" size="lg">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
