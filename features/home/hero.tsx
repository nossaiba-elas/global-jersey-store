"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/shared/product-image";
import { TEAMS, CURRENT_STAGE } from "@/constants/teams";

export function Hero() {
  const featuredTeams = TEAMS.filter((t) => t.stillInCompetition).slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 64px)",
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-0 h-full w-[45%] bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-sm bg-[var(--gold)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--gold-foreground)]">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold-foreground)] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--gold-foreground)]" />
            </span>
            {CURRENT_STAGE} · Live Now
          </span>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95]">
            Wear the
            <br />
            <span className="text-primary">colors</span> of the
            <br />
            world.
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md text-base sm:text-lg">
            Official-style national team jerseys, engineered for fans who don&apos;t just
            watch the game — they wear it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button render={<Link href="/shop" />} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase font-bold tracking-wide">
              Shop Now <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              render={<Link href="/shop?filter=trending" />}
              size="lg"
              variant="outline"
              className="border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5 uppercase font-bold tracking-wide"
            >
              Trending Jerseys
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm">
            <div>
              <div className="text-2xl font-extrabold text-foreground">16</div>
              <span className="text-muted-foreground">national teams</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-extrabold text-foreground">2</div>
              <span className="text-muted-foreground">kits per team</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-extrabold text-[var(--gold)]">4.5★</div>
              <span className="text-muted-foreground">avg. rating</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex justify-center items-center h-72 sm:h-96"
        >
          {featuredTeams.map((team, i) => (
            <motion.div
              key={team.countryCode}
              className="absolute"
              style={{ zIndex: featuredTeams.length - i }}
              initial={{ x: i * 40 - 40, rotate: i * 6 - 6 }}
              animate={{ x: i * 60 - 60, rotate: i * 8 - 8, y: i % 2 === 0 ? -10 : 10 }}
              transition={{ duration: 3 + i, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="rounded-2xl bg-card border border-border p-5 shadow-2xl">
                <ProductImage
                  src={team.jerseyImage}
                  primaryColor={team.primaryColor}
                  secondaryColor={team.secondaryColor}
                  flag={team.flag}
                  alt={`${team.name} jersey`}
                  className="h-44 w-44 sm:h-52 sm:w-52"
                />
                <div className="mt-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {team.flag} {team.name}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
