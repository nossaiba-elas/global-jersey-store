import { Suspense } from "react";
import { ShopContent } from "@/features/shop/shop-content";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
