"use client";

import { useState } from "react";
import { Heart, Star, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/shared/product-image";
import { ProductCard } from "@/components/shared/product-card";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { TEAMS } from "@/constants/teams";
import { getRelatedProducts } from "@/constants/products";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ProductDetails({ product }: { product: Product }) {
  const [size, setSize] = useState<string>(product.sizes[1] ?? product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const team = TEAMS.find((t) => t.countryCode === product.countryCode);
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const related = getRelatedProducts(product);

  function handleAddToCart() {
    addItem({ productId: product.id, size, quantity });
    toast.success(`${product.name} (${size}) added to cart`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-muted flex items-center justify-center p-8 sm:p-14">
          <ProductImage
            src={team?.jerseyImage}
            primaryColor={team?.primaryColor ?? "#111"}
            secondaryColor={team?.secondaryColor ?? "#999"}
            flag={team?.flag ?? ""}
            alt={product.name}
            className="h-72 w-72 sm:h-96 sm:w-96"
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("size-4", i < Math.round(product.rating) ? "fill-primary" : "fill-none")}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews.length} reviews)
            </span>
            {product.stillInCompetition && <Badge>Still Competing</Badge>}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

          <Separator className="my-6" />

          <div>
            <h3 className="text-sm font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-10 min-w-10 px-3 rounded-md border text-sm font-medium transition-colors",
                    size === s ? "bg-primary text-primary-foreground border-primary" : "hover:border-foreground/40"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </Button>
              <span className="w-6 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                +
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                toggleWishlist(product.id);
                toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
            >
              <Heart className={cn("size-5", isWishlisted && "fill-primary text-primary")} />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="size-4" /> Free shipping over $75
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" /> Secure checkout
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
