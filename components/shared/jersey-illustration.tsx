interface JerseyIllustrationProps {
  primaryColor: string;
  secondaryColor: string;
  flag: string;
  className?: string;
}

/**
 * Self-contained SVG jersey illustration, colored per-team.
 * Avoids external image assets / licensing while keeping a premium, consistent look.
 */
export function JerseyIllustration({
  primaryColor,
  secondaryColor,
  flag,
  className,
}: JerseyIllustrationProps) {
  const gradientId = `jersey-grad-${primaryColor.replace("#", "")}-${secondaryColor.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label="Jersey illustration"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <filter id="jersey-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#jersey-shadow)">
        <path
          d="M60 10 L20 40 L35 65 L55 55 L55 200 Q100 210 145 200 L145 55 L165 65 L180 40 L140 10 Q120 25 100 25 Q80 25 60 10 Z"
          fill={`url(#${gradientId})`}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="2"
        />
        <path
          d="M60 10 Q100 5 140 10 L140 22 Q100 32 60 22 Z"
          fill="rgba(255,255,255,0.18)"
        />
        <rect x="55" y="90" width="90" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
      </g>
      <text x="100" y="145" textAnchor="middle" fontSize="36">
        {flag}
      </text>
    </svg>
  );
}
