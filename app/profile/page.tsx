"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { LogOut, Package, Heart, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/firebase";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { PRODUCTS } from "@/constants/products";
import { ProductCard } from "@/components/shared/product-card";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const productIds = useWishlistStore((s) => s.productIds);
  const wishlist = PRODUCTS.filter((p) => productIds.includes(p.id));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoaded(true);
    });
    return unsub;
  }, []);

  if (loaded && !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <UserCircle className="mx-auto size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">You're not signed in</h1>
        <p className="text-muted-foreground mt-2">Sign in to view your profile and orders.</p>
        <Button render={<Link href="/login" />} className="mt-6">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user?.displayName || user?.email || "My Account"}
          </h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        {user && (
          <Button variant="outline" onClick={() => signOut(auth)} className="gap-2">
            <LogOut className="size-4" /> Sign Out
          </Button>
        )}
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders" className="gap-1.5">
            <Package className="size-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-1.5">
            <Heart className="size-4" /> Wishlist
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="pt-8">
          <p className="text-muted-foreground text-sm">
            No orders yet — this is a simulated checkout for portfolio purposes. Place an order from
            the cart to see it appear here once order history is wired up.
          </p>
        </TabsContent>
        <TabsContent value="wishlist" className="pt-8">
          {wishlist.length === 0 ? (
            <p className="text-muted-foreground text-sm">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
