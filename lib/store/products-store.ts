import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "@/constants/products";
import type { Product } from "@/types/product";

interface ProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      products: PRODUCTS,
      addProduct: (product) =>
        set((s) => ({ products: [product, ...s.products] })),
      updateProduct: (id, data) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      resetToDefaults: () => set({ products: PRODUCTS }),
    }),
    { name: "global-jersey-products" }
  )
);
