import { Hero } from "@/features/home/hero";
import { TrendingJerseys } from "@/features/home/trending-jerseys";
import { FeaturedProducts } from "@/features/home/featured-products";
import { BestSellers } from "@/features/home/best-sellers";
import { Categories } from "@/features/home/categories";
import { Newsletter } from "@/features/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrendingJerseys />
      <FeaturedProducts />
      <Categories />
      <BestSellers />
      <Newsletter />
    </>
  );
}
