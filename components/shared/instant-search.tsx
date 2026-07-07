"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/constants/products";
import { formatPrice } from "@/lib/format";

export function InstantSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search jerseys, teams, brands..."
        className="pl-9 pr-8"
        aria-label="Search products"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-popover text-popover-foreground shadow-lg overflow-hidden">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                router.push(`/product/${p.slug}`);
                setOpen(false);
                setQuery("");
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-accent transition-colors"
            >
              <span>
                {p.name} <span className="text-muted-foreground">· {p.country}</span>
              </span>
              <span className="font-medium">{formatPrice(p.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
