"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/format";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { TEAMS } from "@/constants/teams";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const team = TEAMS.find((t) => t.countryCode === product.countryCode);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error("This jersey is out of stock");
      return;
    }
    const defaultSize = product.sizes.includes("M") ? "M" : product.sizes[0];
    addItem({ productId: product.id, size: defaultSize, quantity: 1 });
    toast.success(`${product.name} (${defaultSize}) added to cart`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Card className="group relative overflow-hidden py-0 border-border/60 hover:shadow-lg transition-shadow">
      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
          toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
        }}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
      >
        <Heart
          className={cn(
            "size-4 transition-colors",
            isWishlisted ? "fill-primary text-primary" : "text-foreground"
          )}
        />
      </button>

      <Link href={`/product/${product.slug}`}>
        {/* Product image */}
        <div className="aspect-square bg-muted flex items-center justify-center p-5 overflow-hidden">
          <ProductImage
            src={team?.jerseyImage}
            primaryColor={team?.primaryColor ?? "#111"}
            secondaryColor={team?.secondaryColor ?? "#999"}
            flag={team?.flag ?? ""}
            alt={product.name}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          {/* Badges row — below image, always visible */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.stock === 0 && (
              <Badge variant="destructive" className="text-xs font-semibold uppercase tracking-wide">
                Out of Stock
              </Badge>
            )}
            {product.stillInCompetition && product.stock > 0 && (
              <Badge className="text-xs font-semibold uppercase tracking-wide bg-amber-500 text-white hover:bg-amber-500">
                🔥 Trending
              </Badge>
            )}
            {product.compareAtPrice && (
              <Badge variant="destructive" className="text-xs font-semibold uppercase tracking-wide">
                Sale
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-medium leading-snug line-clamp-2 mt-0.5">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-md h-9 text-sm font-medium transition-colors",
            product.stock === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : justAdded
              ? "bg-emerald-600 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {product.stock === 0 ? (
            "Out of Stock"
          ) : justAdded ? (
            <>
              <Check className="size-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
        <div className="h-9 w-full bg-muted animate-pulse rounded mt-2" />
      </div>
    </div>
  );
}
