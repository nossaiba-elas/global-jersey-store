"use client";

import Link from "next/link";
import { TEAMS } from "@/constants/teams";
import { ProductImage } from "@/components/shared/product-image";

export function Categories() {
  const showcase = TEAMS.slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Shop by Country</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {showcase.map((team) => (
          <Link
            key={team.countryCode}
            href={`/shop?country=${encodeURIComponent(team.name)}`}
            className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <ProductImage
              src={team.jerseyImage}
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              flag={team.flag}
              alt={`${team.name} jersey`}
              className="h-20 w-20 group-hover:scale-105 transition-transform"
            />
            <span className="text-sm font-medium">{team.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
