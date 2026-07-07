"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ProductCard, ProductCardSkeleton } from "@/components/shared/product-card";
import { FiltersSidebar, DEFAULT_FILTERS, type ShopFilters } from "./filters-sidebar";
import { SortDropdown, type SortOption } from "./sort-dropdown";
import { PRODUCTS } from "@/constants/products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 8;

export function ShopContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const country = searchParams.get("country");
    if (country) {
      setFilters((f) => ({ ...f, countries: [country] }));
    }
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const trendingOnly = searchParams.get("filter") === "trending";

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (filters.countries.length && !filters.countries.includes(p.country)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      if (trendingOnly && !p.isTrending) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return list;
  }, [filters, sort, trendingOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shop All Jerseys</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" className="lg:hidden gap-2" />}>
              <SlidersHorizontal className="size-4" /> Filters
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto p-6">
              <SheetTitle className="mb-4">Filters</SheetTitle>
              <FiltersSidebar filters={filters} onChange={setFilters} />
            </SheetContent>
          </Sheet>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <FiltersSidebar filters={filters} onChange={setFilters} />
        </aside>

        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)
              : paginated.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          {!loading && paginated.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No jerseys match your filters. Try adjusting them.
            </p>
          )}

          {!loading && totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="cursor-pointer"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
