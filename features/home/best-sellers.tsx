"use client";

import { ProductCard } from "@/components/shared/product-card";
import { PRODUCTS } from "@/constants/products";

export function BestSellers() {
  const bestSellers = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Best Sellers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
