"use client";

import { useRef, useState, useEffect, useCallback, useMemo, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, ExternalLink, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECTS, CATEGORIES } from "@/data/projects";
import { type Project } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = { stiffness: 90, damping: 18 };
const PER_PAGE = 9;

// ─── CountUp ──────────────────────────────────────────────────────────────────

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 95, damping: 22, mass: 0.5 });
  const [val, setVal] = useState("0");

  useEffect(() => { spring.set(inView ? to : 0); }, [inView, to, spring]);
  useEffect(() => spring.on("change", (v) => {
    const isDecimal = to % 1 !== 0;
    setVal(isDecimal ? v.toFixed(1) : Math.round(v).toString());
  }), [spring, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Image Skeleton ───────────────────────────────────────────────────────────

function ImageSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#ede5d8]/70 dark:bg-[#1f1f1f]" />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.07) 40%, rgba(255,255,255,0.10) 50%, rgba(212,175,55,0.07) 60%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  globalIndex,
  hoveredIdx,
  onHover,
}: {
  project: Project;
  index: number;
  globalIndex: number;
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isHovered = hoveredIdx === globalIndex;
  const isDimmed = hoveredIdx !== null && hoveredIdx !== globalIndex;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), SPRING);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), SPRING);
  const sweepX = useTransform(mouseX, [0, 1], ["-60%", "160%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  };

  const Icon = project.icon;
  const padded = String(globalIndex + 1).padStart(2, "0");

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", ...SPRING, delay: index * 0.08 }}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        opacity: isDimmed ? 0.55 : 1,
        filter: isDimmed ? "brightness(0.88)" : "none",
        transition: "opacity 0.35s, filter 0.35s",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(globalIndex)}
      onMouseLeave={() => {
        onHover(null);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      className="group relative isolate h-full min-h-[560px] flex flex-col"
      aria-label={`${project.title} — ${project.tag}, ${project.year}`}
    >
      {/* Index number */}
      <span
        className="absolute -top-3 -left-1 z-20 font-mono text-[11px] tracking-[0.25em] text-[#C6A969]/30 dark:text-[#D4AF37]/20 select-none pointer-events-none"
        aria-hidden="true"
      >
        {padded}
      </span>

      {/* Gold glow ring */}
      <motion.div
        className="absolute -inset-px rounded-[22px] pointer-events-none z-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered
            ? "0 0 0 1px rgba(198,169,105,0.28), 0 16px 48px rgba(212,175,55,0.10), 0 2px 12px rgba(0,0,0,0.06)"
            : "none",
        }}
        transition={{ duration: 0.32 }}
      />

      {/* Radial bloom */}
      <motion.div
        className="absolute -inset-8 rounded-[40px] pointer-events-none z-0"
        animate={{ opacity: isHovered ? 0.4 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 60%, rgba(212,175,55,0.18), transparent 70%)",
          filter: "blur(12px)",
        }}
        aria-hidden="true"
      />

      {/* Card shell */}
      <div
        className={cn(
          "relative flex-1 flex flex-col overflow-hidden rounded-[20px] h-full",
          "bg-white/70 dark:bg-[#1a1a1a]/80",
          "border border-[rgba(220,212,195,0.65)] dark:border-white/[0.07]",
          "shadow-[0_2px_16px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.90)]",
          "dark:shadow-[0_20px_60px_rgba(0,0,0,0.40),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "backdrop-blur-2xl",
          "transition-shadow duration-500",
          "group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08),0_0_32px_rgba(212,175,55,0.07)]",
          "dark:group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.50),0_0_40px_rgba(212,175,55,0.06)]"
        )}
      >
        {/* Specular top highlight */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px rounded-t-[20px] bg-gradient-to-r from-transparent via-white/85 to-transparent dark:via-white/10 pointer-events-none z-10"
        />

        {/* Corner bracket accents */}
        {(["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r",
           "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"] as const)
          .map((cls, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={cn(
                "absolute w-[18px] h-[18px] pointer-events-none z-10 rounded-[2px]",
                "border-[rgba(168,144,120,0.40)] dark:border-[rgba(212,175,55,0.18)]",
                cls
              )}
            />
          ))}

        {/* Scanline overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[1] opacity-[0.020]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 3px)",
          }}
        />

        {/* Liquid sweep hover */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[2] rounded-[20px] overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 25%, rgba(212,175,55,0.07) 50%, rgba(255,255,255,0.06) 55%, rgba(212,175,55,0.07) 60%, transparent 75%)",
              x: sweepX,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ opacity: { duration: 0.3 } }}
          />
        </motion.div>

        {/* ── Image ── */}
        <div className="relative h-[13.5rem] md:h-[14.5rem] overflow-hidden shrink-0">
          <AnimatePresence>
            {!imgLoaded && (
              <motion.div
                key="skeleton"
                className="absolute inset-0 z-10"
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
              >
                <ImageSkeleton />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="relative w-full h-full"
            animate={{ scale: isHovered ? 1.04 : 1 }}
            transition={{ type: "spring", ...SPRING }}
          >
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onLoad={() => setImgLoaded(true)}
              priority={globalIndex < 3}
            />
          </motion.div>

          {/* Warm gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 dark:from-[#1a1a1a] via-white/[0.06] dark:via-transparent to-[#F5EFE6]/10 dark:to-transparent pointer-events-none" />

          {/* Tag pill */}
          <motion.div
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl text-[10px] font-mono tracking-[0.18em] uppercase select-none"
            style={{
              background: "rgba(198,169,105,0.10)",
              border: "1px solid rgba(198,169,105,0.28)",
              color: "#C6A969",
            }}
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ type: "spring", ...SPRING }}
            aria-label={project.tag}
          >
            <Icon size={10} strokeWidth={1.8} aria-hidden="true" />
            {project.tag}
          </motion.div>

          <span
            className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-widest text-[#1C1C1C]/35 dark:text-white/25 select-none"
            aria-label={`Year: ${project.year}`}
          >
            {project.year}
          </span>

          {/* Stat reveal */}
          <motion.div
            className="absolute bottom-3 right-4 z-10 text-right"
            initial={{ opacity: 0, x: 6 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 6 }}
            transition={{ type: "spring", ...SPRING }}
            aria-hidden="true"
          >
            <div
              className="leading-none text-[#C6A969] dark:text-[#D4AF37] font-serif"
              style={{ fontSize: "1.2rem" }}
            >
              {project.stat.value}
            </div>
            <div
              className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-[#1C1C1C]/35 dark:text-white/25 font-mono"
            >
              {project.stat.label}
            </div>
          </motion.div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 p-6 flex flex-col relative z-[3]">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3
              className="leading-tight tracking-tight font-normal font-serif text-[#1C1C1C] dark:text-[#F0EDE8]"
              style={{
                fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)",
                color: isHovered ? "#C6A969" : undefined,
                transition: "color 0.30s ease",
              }}
            >
              {project.title}
            </h3>
            <motion.div
              aria-hidden="true"
              animate={{ rotate: isHovered ? 45 : 0, opacity: isHovered ? 1 : 0.25 }}
              transition={{ type: "spring", ...SPRING }}
              className="mt-0.5 shrink-0 text-[#C6A969]"
            >
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </motion.div>
          </div>

          <p
            className="leading-relaxed mb-5 flex-1 line-clamp-3 group-hover:line-clamp-none transition-all duration-300 text-[#1C1C1C]/55 dark:text-white/40 font-sans"
            style={{ fontSize: "0.8rem" }}
          >
            {project.description}
          </p>

          {/* Animated gold underline */}
          <div className="relative h-px mb-5 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-[#1C1C1C]/[0.08] dark:bg-white/[0.07]" />
            <motion.div
              className="absolute inset-y-0 left-0"
              animate={{ width: isHovered ? "100%" : "20%" }}
              transition={{ type: "spring", ...SPRING }}
              style={{ background: "linear-gradient(90deg, #C6A969, #D4AF37 60%, transparent)" }}
            />
          </div>

          {/* Tech chips */}
          <ul
            className="flex flex-wrap gap-1.5 mb-5 list-none p-0 m-0"
            aria-label={`Technologies: ${project.tech.join(", ")}`}
          >
            {project.tech.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.08 + i * 0.05 + 0.25 }}
                className="font-mono text-[10px] px-2.5 py-1 rounded-full transition-all duration-300
                   backdrop-blur-md shadow-[0_6px_15px_rgba(0,0,0,0.06)]"
                style={{
                  background: isHovered
                    ? "rgba(198,169,105,0.07)"
                    : "rgba(245,239,230,0.4)",
                  border: isHovered
                    ? "1px solid rgba(198,169,105,0.26)"
                    : "1px solid rgba(28,28,28,0.1)",
                  color: isHovered
                    ? "#C6A969"
                    : "rgba(28,28,28,0.85)",
                }}
              >
                {t}
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <motion.a
              href={project.href}
              className="font-mono text-[10.5px] tracking-[0.22em] uppercase flex items-center gap-1.5 text-[#C6A969] dark:text-[#D4AF37] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A969] focus-visible:ring-offset-2"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: "spring", ...SPRING }}
              aria-label={`View ${project.title} project`}
            >
              View project <ArrowUpRight size={11} strokeWidth={2} aria-hidden="true" />
            </motion.a>
            <span
              className="font-mono text-[9px] text-[#1C1C1C]/20 dark:text-white/15 select-none"
              aria-label={`Version ${project.annotation}`}
            >
              {project.annotation}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

function FilterTabs({
  filters,
  active,
  onChange,
}: {
  filters: readonly string[];
  active: string;
  onChange: (f: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (idx + 1) % filters.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (idx - 1 + filters.length) % filters.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = filters.length - 1;
    } else {
      return;
    }
    refs.current[next]?.focus();
    onChange(filters[next]);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Filter projects by category"
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none md:flex-wrap md:overflow-visible md:pb-0"
    >
      {filters.map((f, idx) => {
        const isActive = active === f;

        return (
          <motion.button
            key={f}
            ref={(el) => { refs.current[idx] = el; }}
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(f)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`
              font-mono text-[11px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full
              border backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.08)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A969] focus-visible:ring-offset-2
              transition-all duration-300 whitespace-nowrap flex-shrink-0
            `}
            style={{
              backgroundColor: isActive
                ? "rgba(198,169,105,0.09)"
                : "rgba(245,239,230,0.4)",
              borderColor: isActive
                ? "rgba(198,169,105,0.35)"
                : "rgba(28,28,28,0.1)",
              color: isActive
                ? "#C6A969"
                : "rgba(28,28,28,0.85)",
            }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", ...SPRING }}
          >
            {f}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Project Archive Hero ─────────────────────────────────────────────────────

function ProjectArchiveHero({ totalProjects }: { totalProjects: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <header ref={ref} className="relative mb-14">
      {/* Radial gold glow */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,175,55,0.08), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Eyebrow */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, x: -14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.12, type: "spring", stiffness: 80, damping: 18 }}
      >
        <div
          aria-hidden="true"
          className="h-px w-10 flex-shrink-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(198,169,105,0.70), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="w-1 h-1 rounded-full flex-shrink-0"
          style={{ background: "#D4AF37", opacity: 0.65 }}
        />
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#C6A969]/70 dark:text-[#D4AF37]/50 font-mono">
          Project Archive
        </p>
      </motion.div>

      {/* Title & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <motion.h1
          className="font-normal leading-[1.06] tracking-tight text-[#1C1C1C] dark:text-[#F0EDE8] font-serif"
          style={{ fontSize: "clamp(42px, 6vw, 82px)" }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          All{" "}
          <em
            className="italic"
            style={{
              background:
                "linear-gradient(90deg, #a89078 0%, #D4AF37 50%, #a89078 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Engineering
          </em>
          <br />
          Work
        </motion.h1>

        <motion.dl
          className="flex gap-10 pb-1"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 18 }}
        >
          {[
            { n: 8, suffix: "", label: "Projects" },
            { n: 1.5, suffix: " yrs", label: "Experience" },
            { n: 70, suffix: "%", label: "Manual Reduction" },
          ].map(({ n, suffix, label }) => (
            <div key={label} className="text-center lg:text-right">
              <dt className="sr-only">{label}</dt>
              <dd
                className="font-normal leading-none text-[#1C1C1C] dark:text-[#F0EDE8] font-serif"
                style={{
                  fontSize: "clamp(26px, 2.8vw, 40px)",
                  letterSpacing: "-0.02em",
                }}
              >
                <CountUp to={n} suffix={suffix} />
              </dd>
              <div
                className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#1C1C1C]/45 dark:text-white/35 mt-1 font-mono"
                aria-hidden="true"
              >
                {label}
              </div>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Subtitle */}
      <motion.p
        className="mt-6 text-[#1C1C1C]/50 dark:text-white/35 font-sans max-w-xl"
        style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 18 }}
      >
        A catalog of production systems, tools, and infrastructure projects.
      </motion.p>

      {/* Animated separator */}
      <motion.div
        aria-hidden="true"
        className="mt-8 h-px w-full"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{
          delay: 0.48,
          duration: 0.85,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(198,169,105,0.35) 20%, rgba(198,169,105,0.35) 80%, transparent)",
        }}
      />
    </header>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectArchivePage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter projects
  const filtered = useMemo(() => {
    if (activeFilter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [activeFilter]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PER_PAGE, filtered.length));
  }, [filtered.length]);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
    setHoveredIdx(null);
  }, []);

  return (
    <section
      aria-label="Project archive"
      className="relative section-padding overflow-hidden"
    >
      {/* ── Background layers ── */}

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.016] dark:opacity-[0.028]"
        style={{
          backgroundImage: "radial-gradient(circle, #1C1C1C 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(212,175,55,0.05), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative container-constrained z-20">
        <ProjectArchiveHero totalProjects={PROJECTS.length} />

        {/* Filters */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, type: "spring", stiffness: 80, damping: 18 }}
        >
          <FilterTabs
            filters={CATEGORIES}
            active={activeFilter}
            onChange={handleFilterChange}
          />
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12"
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence mode="popLayout">
            {displayed.map((project, i) => {
              // Find the global index for the original project position
              const globalIdx = PROJECTS.indexOf(project);
              return (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    type: "spring",
                    ...SPRING,
                    delay: i * 0.06,
                  }}
                >
                  <ProjectCard
                    project={project}
                    index={i}
                    globalIndex={globalIdx}
                    hoveredIdx={hoveredIdx}
                    onHover={setHoveredIdx}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Pagination / Load More */}
        <motion.div
          className="flex flex-col items-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Count indicator */}
          <p className="text-[11px] tracking-[0.26em] uppercase text-[#1C1C1C]/26 dark:text-white/18 font-mono">
            Showing {displayed.length} of {filtered.length} projects
          </p>

          {/* Load More button */}
          {hasMore && (
            <motion.button
              onClick={handleLoadMore}
              className={cn(
                "group relative inline-flex items-center justify-center gap-2.5",
                "rounded-[14px] px-8 h-[52px] text-[13px] font-semibold",
                "bg-[#1C1C1C] dark:bg-[#222] text-white dark:text-[#F3F3F3]",
                "shadow-[0_4px_15px_rgba(0,0,0,0.10)] overflow-hidden cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A969] focus-visible:ring-offset-2 font-mono"
              )}
              style={{ letterSpacing: "0.06em" }}
              whileHover={{
                scale: 1.04,
                y: -2,
                boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", ...SPRING }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
              />
              Load More Projects
              <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          )}
        </motion.div>

      </div>

      {/* Bottom gradient separator */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(198,169,105,0.20) 20%, rgba(198,169,105,0.20) 80%, transparent)",
        }}
      />
    </section>
  );
}
