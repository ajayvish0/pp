'use client'
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useTransform,
  AnimatePresence,
  useMotionValueEvent
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { MapPin, ArrowUpRight, Calendar, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

import { EXPERIENCES } from "@/data/experiences";

/* ── COUNT UP HOOK ────────────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); 
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

/* ── BACKGROUND YEAR ──────────────────────────────────────────────────────── */
function BackgroundYear({ 
  containerRef, 
  activeItem 
}: { 
  containerRef: React.RefObject<HTMLDivElement | null>,
  activeItem: { year: string; index: number } 
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const isInView = useInView(containerRef, {
    margin: "-15% 0px -15% 0px",
    once: false
  });

  // Parallax effect: year moves vertically as you scroll
  const y = useTransform(scrollYProgress, [0, 1], ['5vh', '-5vh']);

  const isLeftCard = activeItem.index % 2 === 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
           style={{ y }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className={cn(
             "relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-[0.16,1,0.3,1]",
             isLeftCard ? "md:translate-x-[15vw]" : "md:-translate-x-[15vw]"
           )}
        >
          <AnimatePresence>
            <motion.span
              key={activeItem.year}
              initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
              animate={{ opacity: 0.035, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.15, filter: "blur(12px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute font-serif text-[28vw] leading-none text-foreground select-none tracking-tighter"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {activeItem.year}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

/* ── SCROLL PROGRESS ──────────────────────────────────────────────────────── */
function ScrollProgress({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  return (
    <motion.div
      className="fixed left-8 top-1/2 -translate-y-1/2 w-[1px] h-32 rounded-full bg-border/30 z-40 hidden lg:block overflow-hidden"
    >
      <motion.div
        className="absolute bottom-0 left-0 w-full origin-bottom"
        style={{
          scaleY,
          background: 'var(--accent)',
          boxShadow: '0 0 10px var(--accent-glow)',
        }}
      />
    </motion.div>
  );
}

/* ── EXPERIENCE CARD ──────────────────────────────────────────────────────── */
function ExperienceCard({
  exp,
  side,
}: {
  exp: (typeof EXPERIENCES)[number];
  side: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' });
  const count = useCountUp(exp.stat, isInView);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.98 }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full max-w-lg"
    >
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100"
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{
          background: 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className={cn(
        "relative p-5 md:p-7 rounded-2xl border transition-all duration-500 overflow-hidden",
        "bg-card/40 backdrop-blur-xl border-border/50",
        hovered && "border-accent/40 bg-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
      )}>
        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-accent"
          initial={{ width: 0 }}
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.4 }}
        />

        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-serif text-2xl font-bold text-foreground leading-tight tracking-tight">
                {exp.companyFull}
              </h3>
              {exp.current && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-medium">
                    Active
                  </span>
                </span>
              )}
            </div>
            <p className="font-sans text-base text-foreground/80 mb-3 font-medium">{exp.role}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <MapPin className="w-3 h-3 text-accent" />
                {exp.location}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-accent" />
                {exp.period}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right flex-shrink-0 flex flex-col items-start sm:items-end min-w-[70px]">
            <div className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-accent/60 bg-clip-text text-transparent leading-none">
              {count}{exp.statSuffix}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2 font-medium">
              {exp.statLabel}
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-border/50 via-border to-border/50 mb-6 opacity-40" />

        <div className="mb-7">
          <p className="font-mono text-xs uppercase tracking-widest text-accent/80 mb-4 font-semibold">
            Impact & Key Results
          </p>
          <ul className="space-y-3.5">
            {exp.highlights.map((h, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + j * 0.1, duration: 0.5 }}
                className="flex items-start gap-3.5"
              >
                <div className="mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0 shadow-[0_0_8px_var(--accent)]" />
                <span className="font-sans text-sm text-foreground/75 leading-relaxed">
                  {h}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {exp.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-[6px] font-mono text-xs uppercase tracking-widest
                         bg-muted/30 text-muted-foreground border border-border/40
                         transition-all duration-300
                         hover:bg-accent/10 hover:text-accent hover:border-accent/30 cursor-default"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── ZIGZAG ENTRY ─────────────────────────────────────────────────────────── */
function ZigzagEntry({
  exp,
  index,
  setItemRef,
}: {
  exp: (typeof EXPERIENCES)[number];
  index: number;
  setItemRef: (el: HTMLDivElement | null) => void;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(localRef, { once: false, margin: '-25% 0px -25% 0px' });
  const isLeft = index % 2 === 0;

  return (
    <div 
      ref={(node) => {
        localRef.current = node;
        setItemRef(node);
      }} 
      className="relative grid grid-cols-[1fr_100px_1fr] gap-0 mb-40 md:grid hidden"
    >
      <div className={cn("flex items-center", isLeft ? "justify-end pr-16" : "invisible items-end justify-end")}>
        <ExperienceCard exp={exp} side="left" />
      </div>

      <div className="flex flex-col items-center relative py-8">
        <div className="absolute top-0 bottom-0 w-[1px] bg-border/20" />
        
        <motion.div
          className="relative z-10 sticky top-[50vh]"
          animate={isInView ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          <motion.div
            className="absolute -inset-6 rounded-full pointer-events-none"
            animate={{ opacity: isInView ? 0.4 : 0 }}
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />

          <div className={cn(
            'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-xl backdrop-blur-md rotate-45',
            isInView
              ? 'border-accent bg-accent/10'
              : 'border-border/60 bg-background'
          )}>
            <div className="-rotate-45">
              {exp.current ? (
                <Globe className="w-5 h-5 text-accent animate-pulse" />
              ) : (
                <Calendar className={cn(
                  'w-5 h-5 transition-colors duration-500',
                  isInView ? 'text-accent' : 'text-muted-foreground/30'
                )} />
              )}
            </div>
          </div>

          <motion.div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center gap-2",
              isLeft ? "-right-24 flex-row" : "-left-24 flex-row-reverse"
            )}
            animate={{ opacity: isInView ? 1 : 0.3, x: isInView ? 0 : (isLeft ? -10 : 10) }}
          >
            <div className="w-8 h-px bg-accent/40" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              {exp.year}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className={cn("flex items-center", !isLeft ? "justify-start pl-16" : "invisible items-start justify-start")}>
        <ExperienceCard exp={exp} side="right" />
      </div>
    </div>
  );
}

/* ── MOBILE ENTRY ─────────────────────────────────────────────────────────── */
function MobileEntry({ 
  exp, 
  index,
  setItemRef
}: { 
  exp: (typeof EXPERIENCES)[number], 
  index: number,
  setItemRef: (el: HTMLDivElement | null) => void;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(localRef, { margin: "-25% 0px -25% 0px" });

  return (
    <div 
      ref={(node) => {
        localRef.current = node;
        setItemRef(node);
      }} 
      className="mb-20 md:hidden relative pl-12"
    >
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent/40 via-border/20 to-accent/40 rounded-full" />
      
      <div className={cn(
        "absolute left-[10px] top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-background z-10",
        exp.current ? "border-accent shadow-[0_0_10px_var(--accent-glow)]" : "border-border"
      )}>
        {exp.current && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
      </div>

      <div className="mb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
          {exp.year}
        </span>
      </div>
      <ExperienceCard exp={exp} side="left" />
    </div>
  );
}

/* ── HEADER ───────────────────────────────────────────────────────────────── */
function Header() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="container-constrained pt-32 pb-24 relative z-10"
    >
      <div className="flex flex-col items-center text-center">
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-accent mb-6 flex items-center gap-4">
          <span className="w-12 h-px bg-accent/30" />
          The Chronicles
          <span className="w-12 h-px bg-accent/30" />
        </p>
        
        <h2 className="font-serif text-5xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9]">
          Professional <br />
          <em className="italic font-normal text-accent bg-gradient-to-br from-accent to-accent/60 bg-clip-text text-transparent">
            Landscape
          </em>
        </h2>
        
        <p className="font-sans text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
          A trajectory of technical growth, product engineering, and strategic contributions across diverse industries.
        </p>

        <div className="relative w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-16 overflow-visible">
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────────────── */

/* ── CTA ──────────────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-40 px-6 relative z-10"
    >
      <div className="max-w-3xl mx-auto border border-border/40 rounded-3xl p-12 lg:p-20 bg-card/20 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-6">
          Future Proofing
        </p>
        
        <h3 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-10 leading-tight">
          Ready to scale your next <br /> 
          <span className="text-accent italic">technical venture?</span>
        </h3>
        
        <a 
          href="/contact" 
          className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-xl
                           bg-foreground text-background font-mono text-xs uppercase tracking-widest
                           transition-all duration-500 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            Start a Conversation <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
          <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        </a>

        <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-accent/20 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-accent/20 rounded-bl-3xl" />
      </div>
    </motion.div>
  );
}



/* ── ROOT ─────────────────────────────────────────────────────────────────── */
export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<{ year: string; index: number }>({ year: EXPERIENCES[0].year, index: 0 });
  
  const desktopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", () => {
    let activeRefs = desktopRefs.current;
    
    // Fallback to mobile refs if desktop items have no height (meaning display: none)
    if (activeRefs[0] && activeRefs[0].getBoundingClientRect().height === 0) {
      activeRefs = mobileRefs.current;
    }

    if (!activeRefs.length || !activeRefs[0]) return;

    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    activeRefs.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - elementCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    const newYear = EXPERIENCES[closestIndex].year;
    if (activeItem.year !== newYear || activeItem.index !== closestIndex) {
      setActiveItem({ year: newYear, index: closestIndex });
    }
  });

  return (
    <div 
    id='experience'
      ref={containerRef} 
      className="relative min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent scroll-mt-24"
      style={{ clipPath: "inset(0)" }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-100px] w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Background year */}
      <BackgroundYear containerRef={containerRef} activeItem={activeItem} />

      <ScrollProgress containerRef={containerRef} />

      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 hidden xl:flex z-40">
        <span className="rotate-90 origin-right">Scroll to explore</span>
        <div className="w-px h-12 bg-border/20 mx-auto mt-16" />
      </div>

      <Header />

      <div className="relative container-constrained">
        <div className="relative">
          {EXPERIENCES.map((exp, i) => (
            <ZigzagEntry 
              key={`desktop-${exp.id}`} 
              exp={exp} 
              index={i} 
              setItemRef={(el) => { desktopRefs.current[i] = el; }} 
            />
          ))}
        </div>

        <div className="md:hidden">
          {EXPERIENCES.map((exp, i) => (
            <MobileEntry 
              key={`mobile-${exp.id}`} 
              exp={exp} 
              index={i} 
              setItemRef={(el) => { mobileRefs.current[i] = el; }} 
            />
          ))}
        </div>
      </div>

      <CTA />
    </div>
  );
}
