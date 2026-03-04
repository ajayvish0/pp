'use client'
import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Server,
  Zap,
  Layers,
  Terminal,
  Code2,
  Cpu,
  Database,
  Layout,
  BarChart2,
  Flame,
  Edit3,
  Clock,
  Cloud,
  Container,
  RotateCcw,
  Shield,
  GitBranch,
  RefreshCw,
  Triangle,
  Box,
  Wind,
  FileType,
  Play,
} from "lucide-react";

// ────────────────────────────────────────────────
// CSS Variables & Theme Setup (add to globals.css or root layout)
/*

:root {
  --bg: #F5EFE6;
  --text: #1C1C1C;
  --surface: #F5EAE0;
  --accent: #C6A969;
  --accent-dark: #D4AF37;
  --accent-gradient: linear-gradient(90deg, #a89078, #d4af37);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111111;
    --text: #F3F3F3;
    --surface: #222222;
    --accent: #D4AF37;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}

.font-serif { font-family: 'Playfair Display', serif; }
.font-sans  { font-family: 'Inter', system-ui, sans-serif; }
.font-mono  { font-family: 'DM Mono', ui-monospace, monospace; }

*/

const SPRING = { stiffness: 85, damping: 20 };
const FILL_SPRING = { stiffness: 120, damping: 20 };
const EASE = [0.16, 1, 0.3, 1] as const;

// Data remains the same
const DOMAINS = [
  {
    index: "01",
    title: "Backend Systems",
    descriptor: "Server Architecture & API Design",
    depth: "Production-grade distributed systems with sub-100ms response targets",
    techs: [
      { label: "Node.js", Icon: Server },
      { label: "Express", Icon: Zap },
      { label: "NestJS", Icon: Layers },
      { label: "FastAPI", Icon: Terminal },
      { label: "Python", Icon: Code2 },
      { label: "Go", Icon: Cpu },
    ],
  },
  {
    index: "02",
    title: "Frontend Engineering",
    descriptor: "Interface Systems & Interaction Layer",
    depth: "Component architectures optimized for performance and accessibility",
    techs: [
      { label: "React", Icon: RefreshCw },
      { label: "Next.js", Icon: Triangle },
      { label: "Redux", Icon: Box },
      { label: "Tailwind CSS", Icon: Wind },
      { label: "TypeScript", Icon: FileType },
      { label: "Framer Motion", Icon: Play },
    ],
  },
  {
    index: "03",
    title: "Data Layer",
    descriptor: "Storage, Caching & Query Optimization",
    depth: "Schema design and data pipeline engineering at scale",
    techs: [
      { label: "MongoDB", Icon: Database },
      { label: "PostgreSQL", Icon: Layout },
      { label: "MySQL", Icon: BarChart2 },
      { label: "Firebase", Icon: Flame },
      { label: "Prisma", Icon: Edit3 },
      { label: "Redis", Icon: Clock },
    ],
  },
  {
    index: "04",
    title: "Cloud & Infra",
    descriptor: "Deployment, Orchestration & Security",
    depth: "Infrastructure-as-code with zero-downtime deployment pipelines",
    techs: [
      { label: "AWS", Icon: Cloud },
      { label: "Docker", Icon: Container },
      { label: "CI/CD", Icon: RotateCcw },
      { label: "Cloudflare", Icon: Shield },
      { label: "GitHub Actions", Icon: GitBranch },
    ],
  },
] as const;


// ────────────────────────────────────────────────
// Tech Node – Unique 3D Hover Effect
function TechNode({
  label,
  Icon,
  staggerIndex,
}: {
  label: string;
  Icon: any;
  staggerIndex: number;
}) {
  const [active, setActive] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Magnetic physics + 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  
  const rotateX = useSpring(useTransform(y, [-50, 50], [15, -15]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-15, 15]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.2); // subtle magnetic pull
    y.set(distanceY * 0.2);
    
    // Dynamic glare coordinates
    const mouseXRatio = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseYRatio = ((e.clientY - rect.top) / rect.height) * 100;
    nodeRef.current.style.setProperty("--mouseX", `${mouseXRatio}%`);
    nodeRef.current.style.setProperty("--mouseY", `${mouseYRatio}%`);
  };

  const handleMouseLeave = () => {
    setActive(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{
        delay: staggerIndex * 0.05,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="group relative isolate cursor-default"
      style={{ perspective: "1000px", zIndex: active ? 10 : 1 }}
      onMouseEnter={() => setActive(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ x: springX, y: springY, rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        <div
          className={`
            relative flex items-center gap-4 px-5 py-4 rounded-2xl
            border backdrop-blur-xl transition-all duration-700
            border-[rgba(220,212,195,0.4)] bg-[var(--surface)]/40
            group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--surface)]/70
            dark:border-white/8 dark:bg-[#222222]/40 dark:group-hover:border-[var(--accent)]/25 dark:group-hover:bg-[#222222]/60
          `}
        >
          {/* Dynamic Glare Overlay */}
          <motion.div 
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay"
            style={{
              background: "radial-gradient(circle at var(--mouseX, 50%) var(--mouseY, 50%), rgba(255,255,255,0.2) 0%, transparent 60%)"
            }}
          />

          {/* Top specular */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent opacity-60" />

          <div
            className={`
              size-11 flex items-center justify-center rounded-xl border transition-all duration-500
              border-[rgba(220,212,195,0.3)] bg-[var(--bg)]/60
              group-hover:border-[var(--accent)]/40
              dark:border-white/7 dark:bg-[#111111]/50 dark:group-hover:border-[var(--accent)]/35
            `}
            style={{ transform: "translateZ(20px)" }} // Pop out effect
          >
            <Icon
              className={`
                size-5 transition-all duration-600
                text-[var(--text)]/50 group-hover:text-[var(--accent)]/90
                dark:text-[#F3F3F3]/50 dark:group-hover:text-[var(--accent)]/85
                ${active ? "drop-shadow-[0_2px_8px_rgba(198,169,105,0.35)]" : ""}
              `}
              strokeWidth={1.5}
            />
          </div>

          <span
            style={{ transform: "translateZ(10px)" }} // Subtle pop out
            className={`
              font-mono text-[11px] uppercase tracking-[0.16em]
              text-[var(--text)]/60 transition-colors duration-500
              group-hover:text-[var(--text)]/90
              dark:text-[#F3F3F3]/60 dark:group-hover:text-[#F3F3F3]/90
            `}
          >
            {label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────
// Domain Band
function DomainBand({
  domain,
  idx,
  expanded,
  setExpanded,
}: {
  domain: (typeof DOMAINS)[number];
  idx: number;
  expanded: number | null;
  setExpanded: (v: number | null) => void;
}) {
  const isOpen = expanded === idx;
  const isDimmed = expanded !== null && !isOpen;

  return (
    <motion.div
      animate={{
        opacity: isDimmed ? 0.42 : 1,
        scale: isDimmed ? 0.985 : 1,
      }}
      transition={{ duration: 0.65, ease: EASE }}
      className="relative isolate"
    >
      <motion.button
        onClick={() => setExpanded(isOpen ? null : idx)}
        className={`
          group relative w-full text-left rounded-[20px]
          border backdrop-blur-xl transition-all duration-800
          border-[rgba(220,212,195,0.5)] bg-[var(--surface)]/30
          hover:border-[var(--accent)]/35 hover:bg-[var(--surface)]/60
          dark:border-white/9 dark:bg-[#222222]/35
          dark:hover:border-[var(--accent)]/30 dark:hover:bg-[#222222]/55
          ${isOpen ? "border-[var(--accent)]/40 bg-[var(--surface)]/50 dark:bg-[#222222]/60" : ""}
        `}
        whileHover={{ scale: 1.004 }}
        transition={{ type: "spring", ...SPRING }}
      >
        {/* Top highlight */}
        <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent opacity-50" />

        <div className="px-7 py-7 lg:px-10 lg:py-9">
          <div className="flex items-center gap-6 lg:gap-10">
            <span
              className={`
                font-mono text-xs uppercase tracking-[0.28em]
                text-[var(--accent)]/60 flex-shrink-0 w-10
              `}
            >
              {domain.index}
            </span>

            <div className="flex-1 relative">
              <h3
                className={`
                  font-serif text-2xl lg:text-3xl font-medium tracking-tight
                  leading-[1.06] text-[var(--text)]
                `}
              >
                {domain.title}
              </h3>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isOpen ? 1 : 0 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="absolute -bottom-1.5 left-0 h-px origin-left w-40 bg-[var(--accent-gradient)]"
              />
            </div>

            <span
              className={`
                hidden lg:block font-mono text-xs tracking-[0.14em]
                text-[var(--text)]/55 transition-all duration-700
                ${isOpen ? "text-[var(--text)]/80" : ""}
              `}
            >
              {isOpen ? domain.depth : domain.descriptor}
            </span>

            <motion.div
              className={`
                size-9 flex items-center justify-center rounded-full border transition-all duration-600
                border-[rgba(220,212,195,0.4)] text-[var(--text)]/60
                group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)]/90
                dark:border-white/10 dark:text-[#F3F3F3]/60
                dark:group-hover:border-[var(--accent)]/35 dark:group-hover:text-[var(--accent)]/90
                ${isOpen ? "border-[var(--accent)]/50 bg-[var(--accent)]/5 text-[var(--accent)]" : ""}
              `}
            >
              <motion.span 
                animate={{ rotate: isOpen ? 135 : 0 }}
                transition={{ duration: 0.65, ease: EASE }}
                className="relative z-10 text-xl font-light leading-none flex items-center justify-center" 
                style={{ height: "100%" }}
              >
                +
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden relative"
          >
            <div className="px-7 pb-10 pt-5 lg:px-10 lg:pb-14 lg:pt-7 relative z-10 lg:pl-[90px]">
              <p className="lg:hidden mb-8 text-sm text-[var(--text)]/70 leading-relaxed">
                {domain.depth}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {domain.techs.map((tech, i) => (
                  <TechNode key={tech.label} label={tech.label} Icon={tech.Icon} staggerIndex={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ────────────────────────────────────────────────
// Main Component
export default function EngineeringMatrix() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });

  const spine = useSpring(scrollYProgress, { stiffness: 45, damping: 20 });
  
  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 lg:py-40 overflow-hidden bg-[var(--bg)]"
    >
      {/* Ambient radial glow – very subtle */}
      <div
        className="absolute left-1/2 top-[25%] -translate-x-1/2 w-[800px] h-[600px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, var(--accent) 0%, transparent 65%)",
          opacity: 0.08,
        }}
      />

      {/* Scroll spine – left aligned, gold fill */}
      <div className="absolute left-6 lg:left-12 top-0 bottom-0 w-px bg-[var(--text)]/5 hidden lg:block pointer-events-none">
        <motion.div
          className="w-full origin-top bg-[var(--accent)]/50"
          style={{ scaleY: spine }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 lg:mb-28">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]/60">
            SYS.CLASS — ENG.MATRIX.v5
          </span>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.06] text-[var(--text)]">
            Engineering
            <span className="italic text-[var(--accent)]/90"> Capability Matrix</span>
          </h1>

          <p className="mt-5 max-w-lg text-[var(--text)]/70 leading-relaxed">
            Precision-engineered systems across the full stack — architecture to deployment.
          </p>
        </div>

        {/* Bands */}
        <div className="space-y-5 lg:space-y-6">
          {DOMAINS.map((domain, i) => (
            <DomainBand
              key={domain.index}
              domain={domain}
              idx={i}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>

        {/* Footer tag */}
        <div className="mt-24 lg:mt-32 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-[var(--text)]/40">
            Refined Digital Alchemy • Precision Engineered Portfolio System
          </span>
        </div>
      </div>
    </section>
  );
}