"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView, useSpring, useTransform, Variants } from "framer-motion";

// ─── Metrics Data ────────────────────────────────────────────────────────────
import { type Metric } from "@/types";

const METRICS: Metric[] = [
  { value: 99.97, suffix: "%", decimals: 2, label: "Uptime SLA", subtext: "distributed systems" },
  { value: 4.2,   suffix: "M", decimals: 1, label: "Requests / Day", subtext: "peak throughput" },
  { value: 38,    suffix: "%", decimals: 0, label: "Latency Reduction", subtext: "architectural refactors" },
  { value: 4,     suffix: "+", decimals: 0, label: "Systems Shipped", subtext: "production-grade" },
];

// ─── Animated Number ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals, suffix, inView }: { value: number; decimals: number; suffix: string; inView: boolean }) {
  const spring = useSpring(0, { stiffness: 95, damping: 22, mass: 0.5 });
  const display = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );
  const [displayVal, setDisplayVal] = useState(decimals > 0 ? (0).toFixed(decimals) : "0");

  useEffect(() => { spring.set(inView ? value : 0); }, [inView, value, spring]);
  useEffect(() => { return display.on("change", setDisplayVal); }, [display]);

  return <>{displayVal}{suffix}</>;
}

// ─── Stat Item ───────────────────────────────────────────────────────────────
const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 22 } },
};

function StatItem({ metric, inView, isLast }: { metric: Metric; inView: boolean; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col gap-2 group"
    >
      {/* Number with soft radial bloom */}
      <motion.div animate={{ y: hovered ? -2 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 22 }} className="relative">
        <motion.div
          animate={{ opacity: hovered ? 0.55 : 0.22 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute -inset-4 rounded-full"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 60%, rgba(212,175,55,0.22), transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        <span
          className="relative block font-normal leading-none text-[#1C1C1C] dark:text-[#F0EDE8] font-serif"
          style={{
            fontSize: "clamp(46px, 6vw, 84px)",
            letterSpacing: "-0.03em",
          }}
        >
          <AnimatedNumber value={metric.value} decimals={metric.decimals} suffix={metric.suffix} inView={inView} />
        </span>
      </motion.div>

      {/* Gradient gold underline */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#1C1C1C]/10 dark:bg-white/10" />
        <motion.div
          className="absolute inset-y-0 left-0"
          animate={{ width: hovered ? "100%" : "30%" }}
          initial={{ width: "30%" }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
          style={{
            background: "linear-gradient(90deg, #C6A969, #D4AF37 60%, transparent)",
          }}
        />
      </div>

      {/* Label */}
      <div
        className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1C1C1C]/50 dark:text-white/40 transition-colors duration-300 group-hover:text-[#C6A969] dark:group-hover:text-[#D4AF37] font-mono"
      >
        {metric.label}
      </div>

      {/* Subtext */}
      <div
        className="text-[12px] text-[#555]/60 dark:text-white/25 leading-snug font-sans"
      >
        {metric.subtext}
      </div>

      {/* Vertical divider (desktop only) */}
      {!isLast && (
        <div
          className="hidden lg:block absolute top-2 -right-px bottom-0 w-px"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(168,144,120,0.25) 30%, rgba(168,144,120,0.25) 70%, transparent)",
          }}
        />
      )}
    </motion.div>
  );
}

// ─── Section Variants ─────────────────────────────────────────────────────────
const sectionVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};
const headerVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

// ─── ImpactMetrics Section ───────────────────────────────────────────────────
export default function ImpactMetrics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative w-full section-padding overflow-hidden"
    >
      {/* Ambient top glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(212,175,55,0.06), transparent 65%)",
        }}
      />

      <motion.div
        className="relative container-constrained"
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Header */}
        <motion.div variants={headerVariants} className="mb-12 flex items-end justify-between">
          <div>
            <p
              className="mb-2 text-[10px] uppercase tracking-[0.32em] text-[#C6A969]/70 dark:text-[#D4AF37]/50 font-mono"
            >
              By the numbers
            </p>
            <h2
              className="text-[clamp(28px,4vw,48px)] font-normal leading-tight tracking-tight text-[#1C1C1C] dark:text-[#F0EDE8] font-serif"
            >
              Engineering Impact
            </h2>
          </div>

          {/* Decorative line + dot */}
          <div className="hidden md:flex flex-1 items-center ml-10 mb-1 gap-3">
            <div
              className="h-px flex-1 max-w-[180px]"
              style={{ background: "linear-gradient(90deg, rgba(198,169,105,0.6), transparent)" }}
            />
            <div className="w-1 h-1 rounded-full" style={{ background: "#D4AF37", opacity: 0.6 }} />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 lg:gap-x-16 gap-y-12">
          {METRICS.map((metric, i) => (
            <StatItem key={i} metric={metric} inView={inView} isLast={i === METRICS.length - 1} />
          ))}
        </div>

        {/* Bottom separator */}
        {/* <motion.div
          variants={headerVariants}
          className="mt-14 h-px w-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(198,169,105,0.3) 20%, rgba(198,169,105,0.3) 80%, transparent)",
          }}
        /> */}
      </motion.div>
    </section>
  );
}