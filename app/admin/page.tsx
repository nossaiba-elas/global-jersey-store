"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/lib/firebase";
import { AdminDashboard } from "@/features/admin/admin-dashboard";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "elasrinossaiba@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="mx-auto size-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground mt-2">You must be signed in to access this page.</p>
        <Button render={<Link href="/login" />} className="mt-6">Sign In</Button>
      </div>
    );
  }

  // Logged in but not admin
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="mx-auto size-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You don&apos;t have permission to view this page. This area is restricted to administrators only.
        </p>
        <Button variant="outline" render={<Link href="/" />} className="mt-6">Back to Home</Button>
      </div>
    );
  }

  // Admin access granted
  return <AdminDashboard />;
}
