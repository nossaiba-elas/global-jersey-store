import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

export interface Order {
  id: string;
  orderNumber: string; // e.g. GJS-2026-000042
  createdAt: string;
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery?: string;
}

interface OrdersState {
  orders: Order[];
  orderCount: number;
  addOrder: (order: Order) => void;
  nextOrderNumber: () => string;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      orderCount: 1000,
      addOrder: (order) =>
        set((s) => ({
          orders: [order, ...s.orders],
          orderCount: s.orderCount + 1,
        })),
      nextOrderNumber: () => {
        const count = get().orderCount + 1;
        const year = new Date().getFullYear();
        return `GJS-${year}-${String(count).padStart(6, "0")}`;
      },
    }),
    { name: "global-jersey-orders" }
  )
);

export function generateOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GJS-${rand}`;
}
