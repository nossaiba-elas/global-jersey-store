import { TEAMS } from "./teams";
import type { Product, JerseyCategory } from "@/types/product";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const KIT_TYPES: { key: JerseyCategory; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "away", label: "Away" },
];

function slugify(input: string) {
  return input.toLowerCase().replace(/\s+/g, "-");
}

// Deterministic pseudo-random helper so values are stable between server & client renders.
function seeded(index: number, min: number, max: number) {
  const x = Math.sin(index * 999) * 10000;
  const frac = x - Math.floor(x);
  return Math.floor(frac * (max - min + 1)) + min;
}

export const PRODUCTS: Product[] = TEAMS.flatMap((team, teamIndex) => {
  return KIT_TYPES.map((kit, kitIndex) => {
    const index = teamIndex * 2 + kitIndex;
    const basePrice = seeded(index, 8499, 12999) / 100;
    const hasDiscount = index % 5 === 0;
    const stock = seeded(index + 50, 0, 60);
    const rating = Number((seeded(index + 100, 35, 50) / 10).toFixed(1));
    const isFeatured = index % 6 === 0;

    return {
      id: `${team.countryCode}-${kit.key}`.toLowerCase(),
      name: `${team.name} ${kit.label} Jersey ${new Date().getFullYear()}`,
      slug: slugify(`${team.name}-${kit.label}-jersey`),
      country: team.name,
      countryCode: team.countryCode,
      brand: team.brand,
      price: basePrice,
      compareAtPrice: hasDiscount ? Number((basePrice + 20).toFixed(2)) : undefined,
      sizes: SIZES,
      description: `Official-style ${team.name} national team ${kit.label.toLowerCase()} jersey. Breathable performance fabric, embroidered crest, and a modern athletic cut inspired by the ${team.name} squad's ${kit.label.toLowerCase()} colors.`,
      images: [],
      stock,
      rating,
      reviews: [
        {
          id: `${team.countryCode}-${kit.key}-r1`,
          userName: "Verified Buyer",
          rating: Math.min(5, Math.round(rating)),
          comment: `Great quality, true to size. Proud to wear the ${team.name} colors.`,
          date: "2026-05-14",
        },
      ],
      isFeatured,
      category: kit.key,
      isTrending: team.stillInCompetition && kit.key === "home",
      stillInCompetition: team.stillInCompetition,
      createdAt: "2026-01-10",
    } satisfies Product;
  });
});

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && (p.country === product.country || p.brand === product.brand)
  ).slice(0, limit);
}
