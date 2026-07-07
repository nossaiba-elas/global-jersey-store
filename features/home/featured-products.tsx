"use client";

import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/constants/products";

export function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="bg-card border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Jerseys</h2>
          <Button variant="ghost" render={<Link href="/shop" />}>
            View all
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
