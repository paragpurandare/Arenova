import React from "react";

/**
 * Razor-sharp Vector SVG Logo for Arenova Sports Ecosystem.
 * Infinite resolution (never blurry), 100% transparent background (no rectangle box/borders).
 *
 * @param {'dark' | 'light'} theme - 'dark' for dark landing page / 'light' for login & portal
 * @param {number} height - logo height in pixels (default 42)
 * @param {string} className - optional extra Tailwind/CSS classes
 */
export default function ArenovaLogo({ theme = "light", height = 44, className = "" }) {
  const isDark = theme === "dark";
  const primaryTextColor = isDark ? "#FFFFFF" : "#08060D";
  const brandGreen = "#1D9E75";
  const brandGreenLight = "#2CD49B";
  const subTextColor = isDark ? "#94A3B8" : "#64748B";

  // Aspect ratio is 4.4 : 1 (width 264, height 60)
  const width = Math.round(height * 4.4);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 330 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`domeGrad-${theme}`} x1="0" y1="0" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D9E75" />
          <stop offset="100%" stopColor="#185FA5" />
        </linearGradient>
        <linearGradient id={`novaGrad-${theme}`} x1="0" y1="0" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1D9E75" />
          <stop offset="100%" stopColor="#2CD49B" />
        </linearGradient>
      </defs>

      {/* ─── LEFT EMBLEM: SPORTS DOME & COURT ──────────────────────────────── */}
      <g transform="translate(6, 6)">
        {/* Outer Dome Arc */}
        <path
          d="M 3 52 A 28 28 0 0 1 59 52"
          fill="none"
          stroke={brandGreen}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Inner Dome Accent Arc */}
        <path
          d="M 10 52 A 21 21 0 0 1 52 52"
          fill="none"
          stroke={brandGreen}
          strokeWidth="1.8"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* Court Baseline Floor */}
        <line
          x1="0"
          y1="52"
          x2="62"
          y2="52"
          stroke={brandGreen}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Center Court Inner Box */}
        <rect
          x="14"
          y="26"
          width="34"
          height="26"
          rx="2"
          fill="none"
          stroke={brandGreen}
          strokeWidth="2.2"
        />

        {/* Center Net Dashed Line */}
        <line
          x1="31"
          y1="26"
          x2="31"
          y2="52"
          stroke={brandGreen}
          strokeWidth="2"
          strokeDasharray="3 2"
        />

        {/* Center Service Mark Dot */}
        <circle cx="31" cy="39" r="2.5" fill={brandGreen} />
      </g>

      {/* ─── TYPOGRAPHY: "Are" + "nova" ────────────────────────────────────── */}
      {/* "Are" */}
      <text
        x="82"
        y="45"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="40"
        fontWeight="900"
        letterSpacing="-1.5px"
        fill={primaryTextColor}
      >
        Are
      </text>

      {/* "nova" */}
      <text
        x="152"
        y="45"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="40"
        fontWeight="900"
        letterSpacing="-1.5px"
        fill={`url(#novaGrad-${theme})`}
      >
        nova
      </text>

      {/* Modern Accent Dot above 'A' */}
      <circle cx="95" cy="11" r="3.2" fill={brandGreenLight} />

      {/* ─── TAGLINE: "BOOK · RENT · PLAY" ─────────────────────────────────── */}
      <text
        x="84"
        y="62"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="700"
        letterSpacing="4.5px"
        fill={subTextColor}
      >
        BOOK · RENT · PLAY
      </text>

      {/* Subtle Green Accent underline bar */}
      <line
        x1="84"
        y1="67"
        x2="140"
        y2="67"
        stroke={brandGreen}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="145"
        y1="67"
        x2="162"
        y2="67"
        stroke={brandGreenLight}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
