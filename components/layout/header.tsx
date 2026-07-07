"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { InstantSearch } from "@/components/shared/instant-search";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-[inset_0_-1px_0_0_var(--border),0_1px_0_0_var(--gold)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle className="px-4 pt-4">Global Jersey Store</SheetTitle>
            <nav className="mt-4 flex flex-col gap-1 px-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg shrink-0">
          <Logo className="size-8 shrink-0" />
          <span className="hidden sm:inline">Global Jersey Store</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:scale-x-0 after:bg-[var(--gold)] after:transition-transform hover:after:scale-x-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden sm:flex justify-center px-4">
          <InstantSearch />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <ThemeToggle />
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
              <Heart className="size-5" />
              {mounted && <CountBadge count={wishlistCount} />}
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingBag className="size-5" />
              {mounted && <CountBadge count={cartCount} />}
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" aria-label="Profile">
              <User className="size-5" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="sm:hidden px-4 pb-3">
        <InstantSearch />
      </div>
    </header>
  );
}
