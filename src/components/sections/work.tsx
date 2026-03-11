"use client";
import { useRef, useState, useEffect, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
  useScroll,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECTS as ALL_PROJECTS } from "@/data/projects";
import { type Project } from "@/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = ALL_PROJECTS.filter((p) => p.featured);

 
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 95, damping: 22, mass: 0.5 });
  const [val, setVal] = useState("0");

  useEffect(() => { spring.set(inView ? to : 0); }, [inView, to, spring]);
  useEffect(() => spring.on("change", (v) => setVal(Math.round(v).toString())), [spring]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Image skeleton ───────────────────────────────────────────────────────────

function ImageSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-muted" />
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // 3-D tilt — plan spec: stiffness 90 / damping 18
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 90, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), { stiffness: 90, damping: 18 });

  // Liquid sweep — position driven by mouse X so it "follows" the cursor
  const sweepX = useTransform(mouseX, [0, 1], ["-60%", "160%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  };

  const Icon = project.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: index * 0.1 }}
      style={{ perspective: 1000, rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      className="group relative isolate h-full min-h-[560px] flex flex-col"
      aria-label={`${project.title} — ${project.tag}, ${project.year}`}
    >
      {/* Gold glow ring */}
      <motion.div
        className="absolute -inset-px rounded-[22px] pointer-events-none z-0"
        animate={{
          opacity: hovered ? 1 : 0,
          boxShadow: hovered
            ? "0 0 0 1px rgba(198,169,105,0.28), 0 16px 48px rgba(212,175,55,0.10), 0 2px 12px rgba(0,0,0,0.06)"
            : "none",
        }}
        transition={{ duration: 0.32 }}
      />

      {/* Radial bloom — ImpactMetrics StatItem pattern */}
      <motion.div
        className="absolute -inset-8 rounded-[40px] pointer-events-none z-0"
        animate={{ opacity: hovered ? 0.4 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 60%, rgba(212,175,55,0.18), transparent 70%)",
          filter: "blur(12px)",
        }}
        aria-hidden="true"
      />

      {/* Card shell — exact glassmorphism from hero.tsx */}
      <div
        className={cn(
          "relative flex-1 flex flex-col overflow-hidden rounded-[20px] h-full",
          "bg-glass-surface",
          "border border-glass-border",
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

        {/* Corner bracket accents — exact hero.tsx values: 18×18 px */}
        {(["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r",
           "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"] as const)
          .map((cls, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={cn(
                "absolute w-[18px] h-[18px] pointer-events-none z-10 rounded-[2px]",
                "border-accent/40 dark:border-accent/20",
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

        {/* Liquid sweep hover — plan requirement */}
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
              opacity: hovered ? 1 : 0,
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

          {/* next/image — plan requirement */}
          <motion.div
            className="relative w-full h-full"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onLoad={() => setImgLoaded(true)}
              priority={index < 3}
            />
          </motion.div>

          {/* Gradient overlays for text contrast */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-[5]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/5 to-transparent pointer-events-none z-[5]" />

          {/* Tag pill — MorphingBadge style */}
          <motion.div
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-mono tracking-widest uppercase select-none border border-white/20 bg-black/40 text-white shadow-sm"
            animate={{ y: hovered ? -2 : 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            aria-label={project.tag}
          >
            <Icon size={10} strokeWidth={1.8} aria-hidden="true" />
            {project.tag}
          </motion.div>

          <div
            className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full backdrop-blur-md font-mono text-[10px] tracking-widest text-white/90 bg-black/40 border border-white/10 select-none shadow-sm"
            aria-label={`Year: ${project.year}`}
          >
            {project.year}
          </div>

          {/* Stat reveal */}
          <motion.div
            className="absolute bottom-3 right-4 z-10 text-right"
            initial={{ opacity: 0, x: 6 }}
            animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 6 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            aria-hidden="true"
          >
            <div
              className="leading-none text-accent font-serif text-xl"
            >
              {project.stat.value}
            </div>
            <div
              className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground font-mono"
            >
              {project.stat.label}
            </div>
          </motion.div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 p-6 flex flex-col relative z-[3]">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3
              className="leading-tight tracking-tight font-normal font-serif text-foreground"
              style={{
                fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)",
                color: hovered ? "#C6A969" : undefined,
                transition: "color 0.30s ease",
              }}
            >
              {project.title}
            </h3>
            <motion.div
              aria-hidden="true"
              animate={{ rotate: hovered ? 45 : 0, opacity: hovered ? 1 : 0.25 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              className="mt-0.5 shrink-0 text-accent"
            >
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </motion.div>
          </div>

          <p
            className="text-sm leading-relaxed mb-5 flex-1 line-clamp-3 group-hover:line-clamp-none transition-all duration-300 text-muted-foreground font-sans"
          >
            {project.description}
          </p>

          {/* Animated gold underline — ImpactMetrics StatItem: 20% → 100% */}
          <div className="relative h-px mb-5 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-foreground/10" />
            <motion.div
              className="absolute inset-y-0 left-0"
              animate={{ width: hovered ? "100%" : "20%" }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
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
  className={cn(
    "font-mono text-[10px] px-2.5 py-1 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_6px_15px_rgba(0,0,0,0.06)] border",
    hovered ? "bg-accent/10 border-accent/30 text-accent" : "bg-secondary/50 border-border text-foreground/80"
  )}
>
  {t}
</motion.li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <motion.a
              href={project.href}
              className="font-mono text-xs tracking-widest uppercase flex items-center gap-1.5 text-accent rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              aria-label={`View ${project.title} project`}
            >
              View project <ArrowUpRight size={11} strokeWidth={2} aria-hidden="true" />
            </motion.a>
            <span
              className="font-mono text-[10px] text-muted-foreground/50 select-none"
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

// ─── Filter tabs — ARIA radiogroup + full keyboard navigation ─────────────────

function FilterTabs({
  filters,
  active,
  onChange,
}: {
  filters: string[];
  active: string | null;
  onChange: (f: string | null) => void;
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
    onChange(next === 0 ? null : filters[next]);
  };

  return (
    <div role="radiogroup" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {filters.map((f, idx) => {
        const isActive = (f === "All" && active === null) || active === f;

        return (
          <motion.button
            key={f}
            ref={(el) => { refs.current[idx] = el; }}
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(f === "All" ? null : f)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`
              font-mono text-xs tracking-widest uppercase px-4 py-1.5 rounded-full
              border backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.08)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              transition-all duration-300
              ${isActive ? "bg-accent/10 border-accent/40 text-accent" : "bg-background/40 border-border text-foreground/80"}
            `}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            {f}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function SelectedWork() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.tag)))];

  const displayedProjects =
    activeFilter && activeFilter !== "All"
      ? PROJECTS.filter((p) => p.tag === activeFilter)
      : PROJECTS;

  const handleFilterChange = useCallback((filter: string | null) => {
    setActiveFilter(filter || "All");
  }, []);

  return (
    <section
      id="work"
      ref={ref}
      aria-label="Selected work"
      className="relative section-padding pt-0 overflow-hidden"
    >
      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.016] dark:opacity-[0.028]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative container-constrained z-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="mb-14"
        >
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
            <p
              className="text-xs uppercase tracking-widest text-accent/70 font-mono"
            >
              Precision Engineered
            </p>
          </motion.div>

          {/* Title & Stats */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2
              className="font-normal leading-[1.06] tracking-tight text-foreground font-serif"
              style={{
                fontSize: "clamp(42px, 6vw, 82px)",
              }}
            >
              Selected
              <br />
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
                Work
              </em>
            </h2>

            <motion.dl
              className="flex gap-10 pb-1"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 18 }}
            >
              {[
                { n: 6, suffix: "+", label: "Projects" },
                { n: 1.5, suffix: " yrs", label: "Experience" },
                { n: 100, suffix: "%", label: "Shipped" },
              ].map(({ n, suffix, label }) => (
                <div key={label} className="text-center lg:text-right">
                  <dt className="sr-only">{label}</dt>
                  <dd
                    className="font-normal leading-none text-foreground font-serif"
                    style={{
                      fontSize: "clamp(26px, 2.8vw, 40px)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <CountUp to={n} suffix={suffix} />
                  </dd>
                  <div
                    className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground mt-1 font-mono"
                    aria-hidden="true"
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.dl>
          </div>

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
        </motion.header>

        {/* Filters */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.42, type: "spring", stiffness: 80, damping: 18 }}
        >
          <FilterTabs
            filters={filters}
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
            {displayedProjects.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          className={cn(
            "flex flex-col sm:flex-row items-center gap-6 mt-16 pt-10 border-t border-border",
            ALL_PROJECTS.length > PROJECTS.length ? "justify-between" : "justify-center"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.72, type: "spring", stiffness: 60, damping: 16 }}
        >
          <p
            className="text-xs tracking-widest uppercase text-muted-foreground/60 font-mono"
          >
            {PROJECTS.length} selected works
          </p>

            <Link href="/projects">
              <motion.div
                className={cn(
                  "group relative inline-flex items-center justify-center gap-2.5",
                  "rounded-[14px] px-8 h-[52px] text-[13px] font-semibold",
                  "bg-zinc-900 dark:bg-zinc-800 text-zinc-50",
                  "shadow-[0_4px_15px_rgba(0,0,0,0.10)] overflow-hidden cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                )}
                style={{ letterSpacing: "0.06em" }}
                whileHover={{
                  scale: 1.04,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
                aria-label="Explore full project archive"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                />
                Explore Archive
                <motion.span
                  aria-hidden="true"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                >
                  <ExternalLink size={13} strokeWidth={1.8} />
                </motion.span>
              </motion.div>
            </Link>
        </motion.div>
      </div>
    </section>
  );
}