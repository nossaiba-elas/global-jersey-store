"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { TEAMS } from "@/constants/teams";
import { PRODUCTS } from "@/constants/products";

export interface ShopFilters {
  countries: string[];
  brands: string[];
  sizes: string[];
  priceRange: [number, number];
}

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];
const BRANDS = Array.from(new Set(TEAMS.map((t) => t.brand)));
const MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)));

interface FiltersSidebarProps {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
}

export function FiltersSidebar({ filters, onChange }: FiltersSidebarProps) {
  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-sm">Country</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {TEAMS.map((team) => (
            <div key={team.countryCode} className="flex items-center gap-2">
              <Checkbox
                id={`country-${team.countryCode}`}
                checked={filters.countries.includes(team.name)}
                onCheckedChange={() =>
                  onChange({ ...filters, countries: toggle(filters.countries, team.name) })
                }
              />
              <Label htmlFor={`country-${team.countryCode}`} className="text-sm font-normal cursor-pointer">
                {team.flag} {team.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 text-sm">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => onChange({ ...filters, brands: toggle(filters.brands, brand) })}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 text-sm">Size</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
                className={`size-9 rounded-md border text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground border-primary" : "hover:border-foreground/40"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 text-sm">
          Price: ${filters.priceRange[0]} — ${filters.priceRange[1]}
        </h3>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={5}
          value={filters.priceRange}
          onValueChange={(value) => onChange({ ...filters, priceRange: value as [number, number] })}
        />
      </div>
    </div>
  );
}

export const DEFAULT_FILTERS: ShopFilters = {
  countries: [],
  brands: [],
  sizes: [],
  priceRange: [0, MAX_PRICE],
};
