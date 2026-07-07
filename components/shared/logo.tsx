import { cn } from "@/lib/utils";

/**
 * Global Jersey Store crest: a sports-club-style shield badge with a star
 * and a jersey silhouette — reads instantly as a football/soccer retail mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 52"
      className={cn("size-8", className)}
      role="img"
      aria-label="Global Jersey Store logo"
    >
      <defs>
        <linearGradient id="gjs-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--primary), black 35%)" />
        </linearGradient>
      </defs>
      <path
        d="M24 1 44 8v15c0 15-8.5 23.8-20 28C12.5 46.8 4 38 4 23V8Z"
        fill="url(#gjs-shield)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <path
        d="M24 4 41 9.8v13.4C41 36 33.5 43.5 24 47 14.5 43.5 7 36 7 23.2V9.8Z"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.75"
      />
      <path d="M24 4 24 47" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
      <path
        d="m24 11 2.7 5.6 6.1.9-4.4 4.4 1 6.2-5.4-2.9-5.4 2.9 1-6.2-4.4-4.4 6.1-.9Z"
        fill="var(--background)"
      />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold tracking-tight", className)}>
      <Logo className="size-8 shrink-0" />
      <span>Global Jersey Store</span>
    </div>
  );
}
