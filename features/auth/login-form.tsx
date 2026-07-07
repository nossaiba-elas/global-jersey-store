"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

function friendlyAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-api-key":
      case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
        return "Firebase isn't connected yet — check the NEXT_PUBLIC_FIREBASE_* environment variables.";
      case "auth/email-already-in-use":
        return "An account already exists with this email. Try signing in instead.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/unauthorized-domain":
        return "This domain isn't authorized in Firebase yet — add it under Authentication > Settings > Authorized domains.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Google sign-in was closed before completing.";
      case "auth/popup-blocked":
        return "Your browser blocked the Google sign-in popup — allow popups and try again.";
      case "auth/operation-not-allowed":
        return "This sign-in method isn't enabled yet in Firebase — enable it under Authentication > Sign-in method.";
      case "auth/weak-password":
        return "Password is too weak — use at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error — check your connection and try again.";
      default:
        return `Auth error (${err.code}). ${err.message}`;
    }
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast.success("Account created! Welcome to Global Jersey Store.");
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast.success("Welcome back!");
      }
      router.push("/profile");
    } catch (err) {
      toast.error(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/profile");
    } catch (err) {
      toast.error(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-center">
        {mode === "signin" ? "Sign In" : "Create Account"}
      </h1>
      <p className="text-sm text-muted-foreground text-center mt-2">
        {mode === "signin" ? "Welcome back to Global Jersey Store." : "Join and start collecting jerseys."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1.5" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="mt-1.5" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
        Continue with Google
      </Button>

      <p className="text-sm text-center text-muted-foreground mt-6">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="font-medium text-foreground underline underline-offset-4"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Create one" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
