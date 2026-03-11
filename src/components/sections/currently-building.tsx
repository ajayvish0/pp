"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

// ─── Data ────────────────────────────────────────────────────────────────────
const PROJECT = {
  index: "01",
  codename: "PropTech\nCRM",
  status: "Active",
  phase: "Phase II — Pipeline Automation",
  stack: "Next.js · Node.js\nMongoDB · Fine tuning",
  progress: 72,
  description:
    "Scalable backend architecture for a property-tech CRM — automating lead generation pipelines, optimizing API performance via scheduled caching, and integrating a production-grade softphone module with real-time call lifecycle management.",
  features: [
    { label: "Lead generation pipeline — automated & live", done: true },
    { label: "API caching layer — 40% performance gain", done: true },
    { label: "Softphone module — call lifecycle integration", done: false },
    { label: "Async background jobs — throughput scaling", done: false },
  ],
  techs: [
    { abbr: "NX", name: "Next.js" },
    { abbr: "ND", name: "Node.js" },
    { abbr: "PG", name: "PostgreSQL" },
    { abbr: "FT", name: "Fine tuning" },
    { abbr: "DK", name: "Docker" },
  ],
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ target, inView }: { target: number; inView: boolean }) {
  const spring = useSpring(0, { stiffness: 70, damping: 18 });
  const widthPct = useTransform(spring, (v) => `${v}%`);
  const labelVal = useTransform(spring, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (inView) spring.set(target);
  }, [inView, target, spring]);

  return (
    <div className="mt-8">
      {/* Track */}
      <div className="relative h-px w-full rounded-full"
           style={{ background: "var(--border-m)" }}>
        {/* Fill */}
        <motion.div
          style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: widthPct, borderRadius: 9999,
            background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 58%, white))",
          }}
        />
        {/* Node */}
        <motion.div
          style={{
            position: "absolute", top: "50%", left: widthPct,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 9px 3px color-mix(in srgb, var(--accent) 42%, transparent)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      {/* Label */}
      <div className="mt-[7px] flex justify-end">
        <motion.span
          className="font-mono text-[0.62rem] tracking-[.12em]"
          style={{ color: "var(--accent)" }}
        >
          {labelVal}
        </motion.span>
      </div>
    </div>
  );
}

// ─── Tech Icon ────────────────────────────────────────────────────────────────
function TechIcon({ abbr, name, delay, inView }: { abbr: string; name: string; delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 9 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={name}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl cursor-default"
      style={{
        width: 56, height: 56,
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border-m)"}`,
        background: hovered ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent",
        transition: "border-color .28s, background .28s",
      }}
    >
      <span
        className="font-mono text-[0.57rem] font-medium tracking-[.08em]"
        style={{ color: hovered ? "var(--accent)" : "var(--muted)", transition: "color .28s", position: "relative", zIndex: 1 }}
      >{abbr}</span>
      <span
        className="font-mono text-[0.41rem] tracking-[.05em] opacity-70 mt-[2px]"
        style={{ color: hovered ? "var(--accent)" : "var(--muted)", transition: "color .28s", position: "relative", zIndex: 1 }}
      >{name.split(".")[0]}</span>
    </motion.div>
  );
}

// ─── Feature Row ──────────────────────────────────────────────────────────────
function FeatureRow({ label, done, delay, inView }: { label: string; done: boolean; delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -7 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start gap-3 rounded-[2px] px-3 py-[0.42rem] cursor-default"
      style={{
        borderLeft: `${hovered ? 2 : 1}px solid ${hovered ? "var(--accent)" : "var(--border-m)"}`,
        background: hovered ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent",
        transition: "border-color .22s, background .22s, border-width .22s",
      }}
    >
      <span
        className="font-mono shrink-0 text-[0.57rem] mt-[1px]"
        style={{ color: done ? "var(--accent)" : "var(--muted)", opacity: done ? 1 : 0.5 }}
      >{done ? "✓" : "○"}</span>
      <span
        className="font-mono text-[0.63rem] leading-[1.55] tracking-[.025em]"
        style={{ color: hovered ? "var(--accent)" : done ? "var(--text)" : "var(--muted)", transition: "color .22s" }}
      >{label}</span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CurrentlyBuilding() {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });
  const panelInView = useInView(panelRef, { once: true, margin: "-40px" });
  const [panelHovered, setPanelHovered] = useState(false);

  return (
    <>
      {/* CSS Variables */}
      <style>{`
        .cb-root {
          --accent:   #C6A969;
          --bg:       #F5EFE6;
          --text:     #1C1C1C;
          --muted:    rgba(28,28,28,0.42);
          --border:   rgba(28,28,28,0.09);
          --border-m: rgba(28,28,28,0.13);
          --panel:    rgba(248,243,236,0.82);
        }
        .dark .cb-root {
          --accent:   #D4AF37;
          --bg:       #111111;
          --text:     #F3F3F3;
          --muted:    rgba(243,243,243,0.40);
          --border:   rgba(243,243,243,0.08);
          --border-m: rgba(243,243,243,0.13);
          --panel:    rgba(22,22,22,0.88);
        }
        @keyframes pdot { 0%,100%{opacity:1} 50%{opacity:.22} }
        .pulse-dot { animation: pdot 2s ease-in-out infinite; }
        @media (max-width: 767px) { .cb-grid { grid-template-columns: 1fr !important; } .cb-col-left { border-right: none !important; border-bottom: 1px solid var(--border-m) !important; } }
        @media (min-width: 768px) and (max-width: 1023px) { .cb-grid { grid-template-columns: 40% 1fr !important; } }
      `}</style>

      <section
        ref={sectionRef}
        className="cb-root relative w-full overflow-hidden py-24 md:py-32"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
          }}
        />

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          aria-hidden
        >
          <div
            style={{
              width: 680, height: 380, borderRadius: "50%",
              background: "radial-gradient(ellipse, color-mix(in srgb, var(--accent) 11%, transparent), transparent 70%)",
              filter: "blur(62px)", opacity: 0.55,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-10 lg:px-14">

          {/* ── HEADER ── */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 md:mb-20"
          >
            {/* Eyebrow */}
            <div className="mb-[1.4rem] flex items-center gap-3">
              <div className="h-px w-7 shrink-0" style={{ background: "var(--accent)" }} />
              <span className="font-mono text-[0.6rem] uppercase tracking-[.22em]" style={{ color: "var(--accent)" }}>
                Live Work
              </span>
            </div>

            {/* Headline */}
            <h2
              className="mb-[1.2rem] font-normal leading-[1.07] tracking-[-0.01em]"
              style={{ fontFamily: '"Playfair Display", serif', fontSize: "clamp(2.4rem, 5.5vw, 4rem)" }}
            >
              Currently{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 58%, white))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Building
              </em>
            </h2>

            {/* Subtext */}
            <p
              className="mb-8 max-w-[500px] text-[0.73rem] leading-[1.75] tracking-[.025em]"
              style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
            >
              Engineering in motion — systems under active development and continuous iteration.
            </p>

            {/* Separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={headerInView ? { scaleX: 1, opacity: 0.42 } : {}}
              transition={{ duration: 1.2, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-px origin-left"
              style={{ background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--border) 65%, transparent) 55%, transparent)" }}
            />
          </motion.div>

          {/* ── PANEL ── */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 28 }}
            animate={panelInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.78, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setPanelHovered(true)}
            onMouseLeave={() => setPanelHovered(false)}
            className="relative overflow-hidden rounded-[3px]"
            style={{
              border: `1px solid ${panelHovered ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border-m)"}`,
              background: "var(--panel)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              transform: panelHovered ? "scale(1.003)" : "scale(1)",
              transition: "border-color .4s ease, transform .4s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* Specular highlight */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
              style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 26%, white) 50%, transparent)" }}
            />

            {/* Left spine */}
            <motion.div
              animate={{ opacity: panelHovered ? 1 : 0.38, scaleY: panelHovered ? 1 : 0.55 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute left-0 w-[2px]"
              style={{
                top: "12%", bottom: "12%",
                background: "linear-gradient(180deg, transparent, var(--accent), transparent)",
                transformOrigin: "center",
              }}
            />

            {/* Build log label */}
            <div
              className="absolute right-5 top-4 z-10 text-[0.53rem] uppercase tracking-[.18em] opacity-40"
              style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
            >
              Build Log — 2026
            </div>

            {/* Grid */}
            <div
              className="cb-grid grid"
              style={{ gridTemplateColumns: "clamp(195px, 30%, 288px) 1fr" }}
            >
              {/* LEFT */}
              <div
                className="cb-col-left px-8 py-10"
                style={{ borderRight: "1px solid var(--border-m)" }}
              >
                <span
                  className="block text-[0.53rem] tracking-[.18em] opacity-55"
                  style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
                >
                  {PROJECT.index}
                </span>

                <h3
                  className="mt-2 mb-6 font-normal leading-[1.07]"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: "clamp(1.55rem, 2.8vw, 2.25rem)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {PROJECT.codename}
                </h3>

                {/* Status */}
                <div className="mb-7 flex items-center gap-[0.55rem]">
                  <div
                    className="pulse-dot h-[6px] w-[6px] shrink-0 rounded-full"
                    style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }}
                  />
                  <span
                    className="text-[0.58rem] uppercase tracking-[.14em]"
                    style={{ fontFamily: '"DM Mono", monospace', color: "var(--accent)" }}
                  >
                    {PROJECT.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-5">
                  {[
                    { label: "Stack", value: PROJECT.stack },
                    { label: "Phase", value: PROJECT.phase },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div
                        className="mb-[5px] text-[0.5rem] uppercase tracking-[.17em] opacity-55"
                        style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
                      >{label}</div>
                      <div
                        className="text-[0.62rem] leading-[1.6] tracking-[.03em]"
                        style={{ fontFamily: '"DM Mono", monospace', color: "var(--text)", whiteSpace: "pre-line" }}
                      >{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="px-8 py-10">
                <p
                  className="mt-5 mb-1 max-w-[560px] text-[0.69rem] leading-[1.78] tracking-[.02em]"
                  style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
                >
                  {PROJECT.description}
                </p>

                {/* Progress */}
                <ProgressBar target={PROJECT.progress} inView={panelInView} />

                {/* Divider */}
                <div className="my-7 h-px" style={{ background: "var(--border)" }} />

                {/* Milestones */}
                <div
                  className="mb-3 text-[0.5rem] uppercase tracking-[.17em] opacity-55"
                  style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
                >
                  Milestones
                </div>
                <div className="flex flex-col gap-[3px]">
                  {PROJECT.features.map((f, i) => (
                    <FeatureRow
                      key={i}
                      label={f.label}
                      done={f.done}
                      delay={panelInView ? 0.28 + i * 0.09 : 0}
                      inView={panelInView}
                    />
                  ))}
                </div>

                {/* Divider */}
                <div className="mt-7 mb-3 h-px" style={{ background: "var(--border)" }} />

                {/* Stack */}
                <div
                  className="mb-3 text-[0.5rem] uppercase tracking-[.17em] opacity-55"
                  style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
                >
                  Stack
                </div>
                <div className="flex flex-wrap gap-[7px]">
                  {PROJECT.techs.map((t, i) => (
                    <TechIcon
                      key={t.abbr}
                      abbr={t.abbr}
                      name={t.name}
                      delay={panelInView ? 0.48 + i * 0.075 : 0}
                      inView={panelInView}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}