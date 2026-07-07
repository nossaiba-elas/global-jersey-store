"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're subscribed! Watch your inbox for drops.");
    setEmail("");
  }

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Mail className="mx-auto size-8 text-primary" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
          Never miss a drop
        </h2>
        <p className="mt-2 text-background/70">
          New kits, restocks and exclusive offers straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="sm:w-72 bg-background text-foreground"
          />
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
