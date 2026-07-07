"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { PRODUCTS } from "@/constants/products";
import { CURRENT_STAGE } from "@/constants/teams";

export function TrendingJerseys() {
  // "Live" section: driven by which teams are still in the competition.
  // Swap this for a real sports-data API call later — the UI won't need to change.
  const trending = PRODUCTS.filter((p) => p.isTrending);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[var(--gold)] font-bold uppercase tracking-wide text-sm">
            <Trophy className="size-4" />
            {CURRENT_STAGE}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mt-1">
            Trending Jerseys
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            The teams still fighting for the trophy — and the jerseys fans are grabbing right now.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {trending.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
