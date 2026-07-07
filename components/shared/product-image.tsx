"use client";

import { useState } from "react";
import { JerseyIllustration } from "@/components/shared/jersey-illustration";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  primaryColor: string;
  secondaryColor: string;
  flag: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Renders the AI-generated jersey product photo when available, and gracefully
 * falls back to the vector illustration if the image fails to load.
 */
export function ProductImage({
  src,
  primaryColor,
  secondaryColor,
  flag,
  alt,
  className,
  imgClassName,
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <JerseyIllustration
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        flag={flag}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={cn("object-contain", className, imgClassName)}
    />
  );
}
