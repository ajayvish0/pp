"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { type GradientBackgroundProps } from "@/types";

export function GradientBackground({
  children,
  className,
  isDragging,
  ...props
}: GradientBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "relative flex h-full w-full overflow-hidden transition-colors duration-700",
        isDragging ? "bg-[#f4efe4] dark:bg-[#121212]" : "bg-background",
        className
      )}
      {...props}
    >
      <div className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#f5efe6] dark:bg-[#111111] transition-all duration-1000 ease-out",
        isDragging ? "scale-[1.03] opacity-90" : "scale-100 opacity-100"
      )}>
        
        {/* Soft Radial Center Background - Warmth and Glow */}
        <div className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,235,215,0.8)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(45,35,30,0.6)_0%,transparent_60%)] transition-opacity duration-1000",
          isDragging ? "opacity-40" : "opacity-100"
        )} />

        {/* Top Right Warm Amber Blob */}
        <div className="absolute -top-[10%] -right-[5%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(235,215,190,0.6)_0%,transparent_75%)] dark:bg-[radial-gradient(circle_at_center,rgba(60,50,40,0.4)_0%,transparent_70%)] blur-[120px] mix-blend-multiply dark:mix-blend-screen" />

        {/* Bottom Left Soft Cream Blob */}
        <div className="absolute -bottom-[15%] -left-[10%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(240,230,220,0.7)_0%,transparent_80%)] dark:bg-[radial-gradient(circle_at_center,rgba(40,35,30,0.4)_0%,transparent_70%)] blur-[140px] mix-blend-multiply dark:mix-blend-screen" />

        {/* Elegant Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)] mix-blend-multiply opacity-100 pointer-events-none" />

        {/* Ultra-subtle Noise texture (SVG grain) */}
        {mounted && (
          <svg className="absolute inset-0 h-full w-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay">
            <defs>
              <filter id="noiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        )}
      </div>

      <div className="relative z-10 flex h-full w-full flex-col">
        {children}
      </div>
    </div>
  );
}
