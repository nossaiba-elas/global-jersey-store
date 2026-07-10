"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useProductsStore } from "@/lib/store/products-store";

export default function WishlistPage() {
  const products = useProductsStore((s) => s.products);
  const productIds = useWishlistStore((s) => s.productIds);
  const items = products.filter((p) => productIds.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Heart className="mx-auto size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Your wishlist is empty</h1>
        <p className="text-muted-foreground mt-2">Tap the heart on any jersey to save it here.</p>
        <Button render={<Link href="/shop" />} className="mt-6">
          Browse Jerseys
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
