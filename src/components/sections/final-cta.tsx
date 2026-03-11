"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";

// ─── Floating Particle ─────────────────────────────────────────────────────────
function Particle({ x, y, size, duration, delay, dx } : any) : any {
    "use client";
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none bg-[#C6A969] dark:bg-[#D4AF37] opacity-0"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        filter: "blur(1px)",
      }}
      animate={{
        opacity: [0, 0.16, 0],
        y: [0, -34, -62],
        x: [0, dx],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Architectural CTA Button ──────────────────────────────────────────────────
function ArchitecturalButton({ label, href }: { label: string; href?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href || "/contact"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="
        relative inline-flex items-center justify-center gap-3
        overflow-hidden cursor-pointer
        h-[52px] px-8 rounded-full
        w-full sm:w-auto
        border border-black/[0.10] dark:border-white/[0.10]
        backdrop-blur-md
        transition-[border-color] duration-300
        no-underline
      "
      style={{
        borderColor: hovered
          ? "var(--tw-prose-links, #C6A969)"
          : undefined,
      }}
    >
      {/* Liquid fill */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#C6A969] dark:bg-[#D4AF37]"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />

      {/* Shimmer sweep */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Label */}
      <span
        className="
          relative z-10
          font-[family-name:var(--font-dm-mono)] tracking-[0.12em] uppercase text-[11px] font-medium
          transition-colors duration-300
        "
        style={{
          fontFamily: "'DM Mono', monospace",
          color: hovered ? "#111111" : undefined,
        }}
      >
        <span className={hovered ? "text-[#111111]" : "text-[#1C1C1C] dark:text-[#F3F3F3]"}>
          {label}
        </span>
      </span>

      {/* Arrow */}
      <motion.span
        className="relative z-10 text-base transition-colors duration-300"
        animate={hovered ? { x: 3, y: -3 } : { x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{
          fontFamily: "monospace",
          color: hovered ? "#111111" : undefined,
        }}
      >
        <span className={hovered ? "text-[#111111]" : "text-[#1C1C1C] dark:text-[#F3F3F3]"}>
          ↗
        </span>
      </motion.span>
    </motion.a>
  );
}

// ─── Underline Text Link ───────────────────────────────────────────────────────
function UnderlineLink({ label, href, target, download }: { label: string; href?: string; target?: string; download?: string | boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href || "#"}
      target={target}
      download={download}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
        relative inline-block
        text-[10px] tracking-[0.14em] uppercase
        text-[#1C1C1C]/40 dark:text-[#F3F3F3]/35
        hover:text-[#1C1C1C]/60 dark:hover:text-[#F3F3F3]/55
        transition-colors duration-200 no-underline
      "
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {label}
      <span
        className="absolute bottom-[-2px] left-0 h-px bg-[#C6A969] dark:bg-[#D4AF37] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: hovered ? "100%" : "0%" }}
      />
    </a>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 26 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 22,
        delay: i * 0.13,
      },
    }),
  };

const [particles, setParticles] = useState<any[]>([]);

useEffect(() => {
  const generated = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 15 + Math.random() * 65,
    size: `${2 + Math.random() * 2.5}px`,
    duration: 5 + Math.random() * 5,
    delay: Math.random() * 6,
    dx: Math.random() * 14 - 7,
  }));

  setParticles(generated);
}, []);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap');

        .cta-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 6.5vw, 5rem);
        }
        .cta-headline em {
          font-style: italic;
          background: linear-gradient(135deg, #C6A969, #a87c3a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dark .cta-headline em {
          background: linear-gradient(135deg, #D4AF37, #f0d078);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <section
        ref={ref}
        className="
          relative w-full overflow-hidden
          bg-[#F5EFE6] dark:bg-[#111111]
          py-20 md:py-28 lg:py-36
          transition-colors duration-500
        "
      >
        {/* Top border */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(198,169,105,0.35) 50%, transparent)",
          }}
        />

        {/* Ambient glow — light */}
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse 700px 340px at 50% 46%, rgba(198,169,105,0.09) 0%, transparent 70%)",
          }}
        />
        {/* Ambient glow — dark */}
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            background:
              "radial-gradient(ellipse 700px 340px at 50% 46%, rgba(212,175,55,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-10 text-center">

          {/* Eyebrow */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={controls}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <div className="h-px w-9 bg-[#C6A969] dark:bg-[#D4AF37] opacity-60" />
            <span
              className="text-[10px] tracking-[0.22em] uppercase text-[#C6A969] dark:text-[#D4AF37]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Open Channel
            </span>
            <div className="h-px w-9 bg-[#C6A969] dark:bg-[#D4AF37] opacity-60" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={controls}
            className="
              cta-headline
              font-semibold leading-[1.08] tracking-[-0.035em]
              text-[#1C1C1C] dark:text-[#F3F3F3]
              mb-7 transition-colors duration-500
            "
          >
            Let&apos;s Build Something
            <br />
            <em>Meaningful.</em>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={controls}
            className="
              text-[clamp(0.78rem,1.4vw,0.9rem)]
              text-[#1C1C1C]/45 dark:text-[#F3F3F3]/38
              max-w-[520px] mx-auto mb-14
              leading-[1.85] tracking-[0.025em]
              transition-colors duration-500
            "
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Focused systems. Thoughtful execution. Built to last.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate={controls}
            className="flex justify-center mb-6 px-0 sm:px-16 md:px-0"
          >
            <ArchitecturalButton label="Start a Conversation" href="#contact" />
          </motion.div>

          {/* Secondary link */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate={controls}
            className="flex justify-center"
          >
            <UnderlineLink label="Download Resume" href="https://drive.google.com/uc?export=download&id=1qmNVtwVGhX9Pg8EAaXR53GU_PYznxvUA" target="_blank" download />
          </motion.div>
        </div>

        {/* Classification tag */}
        <div
          className="
            absolute bottom-5 right-6
            hidden sm:block
            text-[9px] tracking-[0.15em] uppercase
            text-[#1C1C1C]/22 dark:text-[#F3F3F3]/20
            pointer-events-none select-none
          "
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          END.SEQUENCE — SYS.PORTFOLIO.v1
        </div>

        {/* Bottom border */}
        <div
          className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(198,169,105,0.22) 50%, transparent)",
          }}
        />
      </section>
    </>
  );
}