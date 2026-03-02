"use client";

import { useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility
const cn = (...inputs) => twMerge(clsx(inputs));

// ─── Data ────────────────────────────────────────────────────────────────────
 
const MARQUEE_ITEMS = 
[
  {label : "Built for Scale", highlight : false },
  {label : "Engineered for Performance", highlight : true },
  {label : "Production-Ready Backend Systems", highlight : false },
  {label : "Real-Time Architectures", highlight : true },
  {label : "AI-Driven SaaS Platforms" ,highlight : false },
  {label : "High-Throughput APIs", highlight : true },
  {label : "Secure Cloud Infrastructure", highlight : false },
   
  {label : "Tech Futurist", highlight : true }
]
 

// Duplicate for seamless loop
const ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

// ─── Sub-components ──────────────────────────────────────────────────────────

const Separator = () => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex items-center mx-6 shrink-0",
      "text-amber-400/60 dark:text-amber-300/50 select-none"
    )}
    style={{ fontSize: "clamp(0.6rem, 1vw, 0.85rem)" }}
  >
    ✦
  </span>
);

const MarqueeItem = ({ label, highlight }: any) => {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-flex items-center shrink-0 cursor-default group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient bloom behind item on hover */}
      <span className="relative inline-block">
        {hovered && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-60 pointer-events-none"
            style={{
              background: highlight
                ? "radial-gradient(ellipse, rgba(251,191,36,0.45) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(167,139,250,0.35) 0%, transparent 70%)",
              transform: "scale(2.2)",
            }}
          />
        )}

        <span
          className={cn(
            "relative inline-block transition-all duration-500 ease-out select-none",
            highlight
              ? [
                  "font-serif tracking-wide",
                  hovered
                    ? "text-transparent bg-clip-text"
                    : "text-stone-800 dark:text-amber-100/90",
                ]
              : [
                  "font-sans italic tracking-tight font-light",
                  hovered
                    ? "text-transparent bg-clip-text"
                    : "text-stone-600 dark:text-stone-300/80",
                ]
          )}
          style={{
            fontSize: highlight
              ? "clamp(1rem, 2.2vw, 1.45rem)"
              : "clamp(0.85rem, 1.8vw, 1.2rem)",
            fontFamily: highlight
              ? "'Cormorant Garamond', 'Playfair Display', Georgia, serif"
              : "'DM Sans', 'Helvetica Neue', sans-serif",
            fontStyle: highlight ? "normal" : "italic",
            letterSpacing: highlight ? "0.06em" : "0.01em",
            backgroundImage: hovered
              ? highlight
                ? "linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a, #f59e0b)"
                : "linear-gradient(90deg, #a78bfa, #818cf8, #c4b5fd, #a78bfa)"
              : undefined,
            backgroundSize: "200% auto",
            textShadow: hovered
              ? highlight
                ? "0 0 28px rgba(251,191,36,0.55)"
                : "0 0 24px rgba(167,139,250,0.5)"
              : "none",
            fontWeight: highlight ? 600 : 300,
          }}
        >
          {label}
        </span>
      </span>
    </span>
  );
};

// ─── Noise overlay SVG (base64 grain) ────────────────────────────────────────

const GrainOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-20 opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundSize: "128px 128px",
    }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarqueeStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        "bg-stone-50 dark:bg-[#0d0d0e]",
        "py-5 sm:py-6"
      )}
      aria-label="Skills and disciplines marquee"
    >
      {/* ── Top glow separator ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.35) 30%, rgba(167,139,250,0.4) 60%, transparent 100%)",
          boxShadow: "0 0 12px 1px rgba(251,191,36,0.18)",
        }}
      />

      {/* ── Bottom glow separator ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.35) 30%, rgba(251,191,36,0.4) 65%, transparent 100%)",
          boxShadow: "0 0 12px 1px rgba(167,139,250,0.15)",
        }}
      />

      {/* ── Ambient hover glow (always visible, subtle) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(167,139,250,0.05) 0%, transparent 80%)",
        }}
      />

      {/* ── Glassmorphism bloom layer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(251,191,36,0.04) 0%, rgba(167,139,250,0.03) 50%, transparent 80%)",
          filter: "blur(16px)",
        }}
      />

      {/* ── Vignette left edge ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-40"
        style={{
          background:
            "linear-gradient(to right, var(--vignette-color, #fafaf9) 0%, transparent 100%)",
        }}
      />
      {/* ── Vignette right edge ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-40"
        style={{
          background:
            "linear-gradient(to left, var(--vignette-color, #fafaf9) 0%, transparent 100%)",
        }}
      />

      {/* CSS custom property for vignette color per theme */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:ital,wght@1,300;1,400&display=swap');

        :root { --vignette-color: #fafaf9; }
        .dark { --vignette-color: #0d0d0e; }

        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee-scroll 38s linear infinite;
          will-change: transform;
        }

        .marquee-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Grain overlay ── */}
      <GrainOverlay />

      {/* ── Scrolling track ── */}
      <div
        className="relative z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-hidden="false"
      >
        <div
          className={cn("marquee-track flex items-center whitespace-nowrap", paused && "paused")}
        >
          {ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <MarqueeItem label={item?.label} highlight={item?.highlight} />
              <Separator />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}