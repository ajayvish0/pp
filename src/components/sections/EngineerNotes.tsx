"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useSpring,
} from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const NOTES = [
  {
    index: "01",
    cat: "Architecture",
    date: "Feb 2026",
    title: "The Real Cost of Abstraction Layers",
    summary:
      "Every abstraction is a bet that the future resembles today's assumptions. The best codebases delay generalization until a pattern emerges three times — premature abstraction creates coupling that is invisible during development and punishing during scale.",
    expanded:
      "Working on the PropTech CRM backend reinforced this: the impulse to genericize the lead-ingestion layer early would have hardened assumptions about source format and frequency. Instead, keeping it concrete through the first two integrations revealed the actual shape of the abstraction. The resulting module was half the code and far more resilient.",
    meta: "Architecture · System Design · Backend",
  },
  {
    index: "02",
    cat: "Performance",
    date: "Jan 2026",
    title: "Latency as a Product Personality",
    summary:
      "When we optimized the CRM API layer from ~340ms to ~67ms median response, the shift wasn't just in metrics — it changed how users described the product. Response time is the system speaking before any UI element does. Engineers who treat it as purely technical miss a product lever.",
    expanded:
      "The optimization path combined scheduled caching for high-frequency lookups, upsert-based DB sync to remove redundant writes, and moving non-critical tasks into async background jobs. Each change was small; the compound effect was a 40% throughput improvement. The lesson: latency budgets belong in product specs, not post-incident reviews.",
    meta: "Performance · Infrastructure · API Design",
  },
  {
    index: "03",
    cat: "Reliability",
    date: "Nov 2025",
    title: "Designing Systems That Fail Gracefully",
    summary:
      "The failures that cause the most damage are never in the runbook. Building the Jobra AI ATS taught me that robustness comes not from predicting every failure mode, but from designing recovery paths that work even for surprises.",
    expanded:
      "Distributed pipelines processing applicant data across ML scoring, storage, and notification layers are inherently fault-prone. We treated every anomaly as a signal, not noise — implementing circuit breakers, idempotent retry logic, and structured degradation paths. The result was a system that maintained 99.9% uptime without requiring perfect upstream behaviour.",
    meta: "Reliability · Distributed Systems · ATS",
  },
  {
    index: "04",
    cat: "Systems",
    date: "Oct 2025",
    title: "Event Schemas Are Contracts in Disguise",
    summary:
      "Async event systems feel decoupled at the interface but are semantically coupled beneath. Changing what an event means is harder than changing a synchronous API — the feedback loop is slower and the blast radius much larger.",
    expanded:
      "This surfaced during Jobra AI's recruiter pipeline refactor. Events emitted by the ML scoring layer were consumed by three downstream systems. A silent schema drift caused a reporting discrepancy that took two days to trace. Since then, schema versioning and consumer-aware migration paths are non-negotiables in any event-driven architecture I design.",
    meta: "Architecture · Events · Domain Design",
  },
];

// ─── Scroll Spine ─────────────────────────────────────────────────────────────
function Spine({ sectionRef }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div className="relative h-full">
      {/* Track */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
        style={{ background: "var(--border-m)" }}
      />
      {/* Fill */}
      <motion.div
        className="absolute left-1/2 top-0 w-px -translate-x-1/2"
        style={{
          height: "100%",
          background: "linear-gradient(180deg, var(--accent), transparent)",
          scaleY,
          transformOrigin: "top",
        }}
      />
      {/* Date markers */}
      <div className="relative z-10">
        {NOTES.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
            className="text-right text-[0.5rem] tracking-[.12em] pr-5"
            style={{
              fontFamily: '"DM Mono", monospace',
              color: "var(--muted)",
              padding: "clamp(1.75rem, 3vw, 2.5rem) 1.25rem clamp(1.75rem, 3vw, 2.5rem) 0",
            }}
          >
            {n.date}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Note Entry ───────────────────────────────────────────────────────────────
function NoteEntry({ note, i, openIndex, setOpenIndex, dimmed }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);
  const isOpen = openIndex === i;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: dimmed ? 0.52 : 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{
        opacity: { duration: 0.32, ease: "easeOut" },
        y: { duration: 0.62, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setOpenIndex(isOpen ? -1 : i)}
      className="relative cursor-pointer"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Accent bar */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 85, damping: 20 }}
        className="absolute left-[-1px] w-[1.5px]"
        style={{
          top: "18%", bottom: "18%",
          background: "var(--accent)",
          transformOrigin: "center",
        }}
      />

      {/* Hover bg */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        className="pointer-events-none absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--accent) 3.5%, transparent)" }}
      />

      {/* Content */}
      <div
        className="relative z-10 pr-2"
        style={{ padding: "clamp(1.75rem, 3vw, 2.5rem) 0.5rem clamp(1.75rem, 3vw, 2.5rem) 0" }}
      >
        {/* Top row */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className="text-[0.56rem] tracking-[.14em]"
            style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
          >
            {note.index}
          </span>

          <span
            className="rounded-[1px] border text-[0.53rem] uppercase tracking-[.18em] px-[0.5rem] py-[0.16rem]"
            style={{
              fontFamily: '"DM Mono", monospace',
              color: "var(--accent)",
              borderColor: "color-mix(in srgb, var(--accent) 32%, transparent)",
            }}
          >
            {note.cat}
          </span>

          <span
            className="ml-auto text-[0.53rem] tracking-[.1em]"
            style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
          >
            {note.date}
          </span>
        </div>

        {/* Title */}
        <div className="mb-4 pl-3">
          <motion.h3
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 85, damping: 20 }}
            className="relative inline-block font-normal leading-[1.2] tracking-[-0.01em]"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(1.28rem, 2.4vw, 1.85rem)",
              color: "var(--text)",
            }}
          >
            {note.title}
            {/* Gold underline */}
            <motion.span
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[-2px] left-0 h-px"
              style={{ background: "var(--accent)" }}
            />
          </motion.h3>
        </div>

        {/* Summary */}
        <p
          className="mb-4 max-w-[640px] font-light leading-[1.72] tracking-[0.01em] pl-4"
          style={{
            fontFamily: '"Crimson Pro", Georgia, serif',
            fontSize: "clamp(0.93rem, 1.7vw, 1.06rem)",
            color: "var(--muted-s)",
          }}
        >
          {note.summary}
        </p>

        {/* Expanded */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="border-t pt-4 mb-4 pl-4" style={{ borderColor: "var(--border)" }}>
                <p
                  className="max-w-[600px] font-light leading-[1.85] tracking-[0.015em]"
                  style={{
                    fontFamily: '"Crimson Pro", Georgia, serif',
                    fontSize: "clamp(0.88rem, 1.55vw, 0.98rem)",
                    color: "var(--muted-s)",
                  }}
                >
                  {note.expanded}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meta */}
        <div
          className="text-[0.52rem] tracking-[.14em] opacity-60"
          style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
        >
          {note.meta}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EngineeringNotes() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-50px" });
  const [openIndex, setOpenIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <>
      <style>{`
        .en-root {
          --accent:   #C6A969;
          --bg:       #F5EFE6;
          --text:     #1C1C1C;
          --muted:    rgba(28,28,28,0.38);
          --muted-s:  rgba(28,28,28,0.56);
          --border:   rgba(28,28,28,0.08);
          --border-m: rgba(28,28,28,0.12);
        }
        .dark .en-root {
          --accent:   #D4AF37;
          --bg:       #111111;
          --text:     #F3F3F3;
          --muted:    rgba(243,243,243,0.36);
          --muted-s:  rgba(243,243,243,0.52);
          --border:   rgba(243,243,243,0.07);
          --border-m: rgba(243,243,243,0.12);
        }
        @media (max-width: 767px) {
          .en-body { grid-template-columns: 1fr !important; }
          .en-spine { display: none !important; }
          .en-archive { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .en-body { grid-template-columns: 100px 1fr !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="en-root relative w-full overflow-hidden py-24 md:py-32 lg:py-36"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
          }}
        />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center" aria-hidden>
          <div
            style={{
              width: 580, height: 280, borderRadius: "50%",
              background: "radial-gradient(ellipse, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)",
              filter: "blur(62px)", opacity: 0.48,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 md:px-10 lg:px-14">

          {/* ── HEADER ── */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 18 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-14 md:mb-20"
          >
            {/* Archive tag */}
            <div
              className="en-archive absolute right-0 top-0 text-[0.5rem] uppercase tracking-[.2em] opacity-40"
              style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
            >
              Archive — System.Log.v3
            </div>

            {/* Eyebrow */}
            <div className="mb-[1.4rem] flex items-center gap-3">
              <div className="h-px w-6 shrink-0" style={{ background: "var(--accent)" }} />
              <span
                className="text-[0.6rem] uppercase tracking-[.22em]"
                style={{ fontFamily: '"DM Mono", monospace', color: "var(--accent)" }}
              >
                Field Notes
              </span>
            </div>

            {/* Headline */}
            <h2
              className="mb-[1.2rem] font-normal leading-[1.08] tracking-[-0.015em]"
              style={{ fontFamily: '"Playfair Display", serif', fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Engineering{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(132deg, var(--accent), color-mix(in srgb, var(--accent) 52%, white))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Notes
              </em>
            </h2>

            {/* Subtext */}
            <p
              className="mb-8 max-w-[480px] text-[0.71rem] leading-[1.78] tracking-[.025em]"
              style={{ fontFamily: '"DM Mono", monospace', color: "var(--muted)" }}
            >
              Fragments of architecture thinking, captured during active system design and deep technical iteration.
            </p>

            {/* Separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={headerInView ? { scaleX: 1, opacity: 0.44 } : {}}
              transition={{ duration: 1.2, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-px origin-left"
              style={{ background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--border) 60%, transparent) 58%, transparent)" }}
            />
          </motion.div>

          {/* ── BODY ── */}
          <div
            className="en-body grid gap-0"
            style={{ gridTemplateColumns: "160px 1fr" }}
          >
            {/* Spine */}
            <div className="en-spine">
              <Spine sectionRef={sectionRef} />
            </div>

            {/* Notes */}
            <div>
              {NOTES.map((note, i) => (
                <NoteEntry
                  key={i}
                  note={note}
                  i={i}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  dimmed={hoveredIndex !== -1 && hoveredIndex !== i}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}