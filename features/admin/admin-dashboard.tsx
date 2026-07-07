"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/format";
import { PRODUCTS } from "@/constants/products";
import type { Product } from "@/types/product";

const MOCK_ORDERS = [
  { id: "ORD-1042", customer: "Yasmine B.", total: 129.98, status: "Shipped" },
  { id: "ORD-1041", customer: "Karim T.", total: 89.99, status: "Processing" },
  { id: "ORD-1040", customer: "Alicia M.", total: 259.97, status: "Delivered" },
];

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS.slice(0, 12));
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  function handleSave(updated: Partial<Product>) {
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...updated } : p))
      );
      toast.success("Product updated (demo — connect Firestore to persist).");
    } else {
      const newProduct: Product = {
        id: `custom-${Date.now()}`,
        name: updated.name || "New Jersey",
        slug: `new-jersey-${Date.now()}`,
        country: updated.country || "Custom",
        countryCode: "XX",
        brand: updated.brand || "Generic",
        price: Number(updated.price) || 79.99,
        sizes: ["S", "M", "L", "XL"],
        description: "New product added via admin dashboard.",
        images: [],
        stock: Number(updated.stock) || 0,
        rating: 0,
        reviews: [],
        isFeatured: false,
        category: "home",
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product created (demo — connect Firestore to persist).");
    }
    setOpen(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" onClick={() => setEditing(null)} />}>
            <Plus className="size-4" /> Add Product
          </DialogTrigger>
          <ProductFormDialog editing={editing} onSave={handleSave} />
        </Dialog>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products" className="gap-1.5">
            <Package className="size-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="pt-6">
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card text-left">
                <tr>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium">Brand</th>
                  <th className="p-3 font-medium">Price</th>
                  <th className="p-3 font-medium">Stock</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.brand}</td>
                    <td className="p-3">{formatPrice(p.price)}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        defaultValue={p.stock}
                        className="h-8 w-20"
                        onBlur={(e) =>
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, stock: Number(e.target.value) } : prod
                            )
                          )
                        }
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(p);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="pt-6">
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card text-left">
                <tr>
                  <th className="p-3 font-medium">Order</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Total</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.customer}</td>
                    <td className="p-3">{formatPrice(o.total)}</td>
                    <td className="p-3">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductFormDialog({
  editing,
  onSave,
}: {
  editing: Product | null;
  onSave: (data: Partial<Product>) => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
      </DialogHeader>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onSave({
            name: String(form.get("name") || editing?.name),
            brand: String(form.get("brand") || editing?.brand),
            country: String(form.get("country") || editing?.country),
            price: Number(form.get("price") || editing?.price),
            stock: Number(form.get("stock") || editing?.stock),
          });
        }}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={editing?.name} className="mt-1.5" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" defaultValue={editing?.brand} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={editing?.country} className="mt-1.5" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={editing?.price} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" defaultValue={editing?.stock} className="mt-1.5" required />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImagePlus className="size-4" /> Image upload connects to Firebase Storage once configured.
        </div>
        <DialogFooter>
          <Button type="submit">{editing ? "Save Changes" : "Create Product"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
