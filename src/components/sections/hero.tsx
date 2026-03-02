"use client";

import {
  motion,
  Variants,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { GradientBackground } from "@/components/ui/gradient-background";
import { ArrowRight, Sparkles, Download, Code, Terminal, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const BADGE_ITEMS = [
  { text: "Architecting scalable backend systems", Icon: Sparkles },
  { text: "Building production-grade web apps", Icon: Code },
  { text: "Optimizing performance at scale", Icon: Layers },
  { text: "Turning complexity into reliable systems", Icon: Terminal },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const textVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 20 } },
};
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18, delay: 0.5 } },
};
const orbVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.7 } },
};

/* ── Typewriter ─────────────────────────────────────── */
function useTypewriter(lines: string[], speed = 38) {
  const [display, setDisplay] = useState<string[]>(["", "", ""]);
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");
  const charIdx = useRef(0);
  const allText = lines.join("\n");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (charIdx.current < allText.length) {
        t = setTimeout(() => {
          charIdx.current++;
          const parts = allText.slice(0, charIdx.current).split("\n");
          setDisplay([parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""]);
        }, speed);
      } else {
        t = setTimeout(() => setPhase("pause"), 2200);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("erasing"), 600);
    } else {
      if (charIdx.current > 0) {
        t = setTimeout(() => {
          charIdx.current--;
          const parts = allText.slice(0, charIdx.current).split("\n");
          setDisplay([parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""]);
        }, speed / 2);
      } else {
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [phase, display]);

  return display;
}

function MorphingBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % BADGE_ITEMS.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const { text, Icon } = BADGE_ITEMS[index];

  return (
    <div
      style={{
        position: "relative",
        width: "fit-content",
        padding: "2px", // subtle breathing room
      }}
    >
      {/* Soft outer glow / breathing ring – gentle & elegant */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(0deg, rgba(168,144,120,0.5), rgba(212,175,55,0.3), rgba(168,144,120,0.5))",
            "linear-gradient(180deg, rgba(168,144,120,0.5), rgba(212,175,55,0.3), rgba(168,144,120,0.5))",
            "linear-gradient(360deg, rgba(168,144,120,0.5), rgba(212,175,55,0.3), rgba(168,144,120,0.5))",
          ],
        }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          padding: "1.5px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Main pill container */}
     <div
  className="
    relative flex items-center gap-[10px] overflow-hidden z-[1]
    h-[42px] min-w-[260px] px-[18px] pl-[14px] rounded-full
    backdrop-blur-[16px]
    bg-[linear-gradient(145deg,#ffffff_0%,#fbf8f2_100%)]
    border border-[rgba(220,210,195,0.65)]
    shadow-[0_3px_14px_rgba(140,120,100,0.09),inset_0_1px_0_rgba(255,255,255,0.7)]

    dark:bg-[linear-gradient(145deg,#141414_0%,#1c1c1c_100%)]
    dark:border-[rgba(212,175,55,0.25)]
    dark:shadow-[0_6px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)]
  "
>
        {/* Subtle liquid sweep on change */}
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.08) 45%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </AnimatePresence>

        {/* Icon with smooth spring transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.72, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.72, rotate: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{ display: "flex", flexShrink: 0 }}
          >
           <Icon className="w-4 h-4 text-[#9f8462] dark:text-[#d4af37]" />
          </motion.div>
        </AnimatePresence>

        {/* Text with gentle per-character animation */}
        <AnimatePresence mode="wait">
         <motion.div
  key={index}
  className="flex text-[13px] font-semibold tracking-[-0.005em] whitespace-nowrap text-[#1f1a14] dark:text-[#f5f1e8]"
>
            {text.split("").map((char, i) => (
              <motion.span
                key={`${index}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  delay: i * 0.016,
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
/* ── Component ───────────────────────────────────────── */
export function Hero() {
  const [isOrbDragging, setIsOrbDragging] = useState(false);

  const arrowX = useMotionValue(0);
  const smoothArrowX = useSpring(arrowX, { stiffness: 300, damping: 20 });

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-80, 80], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleCardMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const typedLines = useTypewriter([
    "function buildElegant() {",
    "  return refinedDigital;",
    "}",
  ]);

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col overflow-hidden">
      <GradientBackground className="flex-1 flex flex-col" isDragging={isOrbDragging}>
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-10 pt-14  md:pt-28 lg:pt-32 pb-12 flex-1 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-6">

          {/* ── LEFT COL ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:w-[55%] z-20"
          >
            {/* Morphing badge */}
            <motion.div variants={badgeVariants} className="mb-10 lg:mb-12">
              <MorphingBadge />
            </motion.div>

            {/* Headline */}
            <motion.h1 className="font-serif text-[#1C1C1C] dark:text-[#F3F3F3] leading-[1.06] tracking-tight mb-5 lg:mb-6 text-[38px] sm:text-[46px] md:text-[52px] lg:text-[58px] xl:text-[64px] font-bold">
              <motion.span variants={textVariants} className="block">Engineering scalable</motion.span>
              <motion.span variants={textVariants} className="block">systems built for</motion.span>
              <motion.span
                variants={textVariants}
                className="block italic font-normal"
                style={{
                  background: "linear-gradient(90deg, #a89078 0%, #d4af37 50%, #a89078 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <motion.span
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline", backgroundSize: "200% 100%" }}
                >
                  real-world impact.
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              variants={textVariants}
              className="text-[15px] md:text-[16px] lg:text-[17px] text-[#1C1C1C]/70 dark:text-[#C8C8C8] max-w-[440px] mb-5 lg:mb-6 leading-[1.75]"
            >
              I architect scalable backend systems and performance-driven web applications built for production environments.
            </motion.p>

            {/* Authority line */}
            <motion.div
              variants={textVariants}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-2.5 text-[11px] font-bold text-[#1C1C1C]/45 dark:text-[#9A9A9A] tracking-[0.2em] mb-6 lg:mb-8 uppercase"
            >
              <span>Scalable Backend Systems</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span>Production-Focused</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span>Open to Remote</span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={textVariants}
              className="relative flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <div className="absolute -inset-x-8 -inset-y-6 bg-[radial-gradient(ellipse_at_center,rgba(230,218,200,0.6)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] rounded-full pointer-events-none -z-10" />

              <Link href="/projects" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onHoverStart={() => arrowX.set(5)}
                  onHoverEnd={() => arrowX.set(0)}
                  className="group relative inline-flex items-center justify-center w-full sm:w-auto rounded-[14px] px-8 h-[52px] text-[15px] font-semibold bg-[#1C1C1C] dark:bg-[#222] text-white dark:text-[#F3F3F3] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-shadow duration-400 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <span>Explore Selected Work</span>
                  <motion.span style={{ x: smoothArrowX }} className="inline-block ml-2">
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.div>
              </Link>

              <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center justify-center w-full sm:w-auto rounded-[14px] px-8 h-[52px] text-[15px] font-semibold border border-[#dcd4c7] dark:border-[#3a3a3a] text-[#1C1C1C] dark:text-[#B5B5B5] bg-white/50 dark:bg-white/5 hover:bg-[#f0e8dc] dark:hover:bg-[#2a2a2a] shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-shadow duration-400 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" style={{ animationDuration: "0.6s", animationIterationCount: 1 }} />
                  <span>Download Resume</span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COL ── */}
          <div className="relative w-full lg:w-[45%] h-[380px] sm:h-[420px] lg:h-auto lg:min-h-[480px] flex items-center justify-center mt-6 lg:mt-0">

            {/* Ambient glow pools */}
            <div style={{
              position: "absolute",
              top: "10%", left: "5%",
              width: 180, height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <div style={{
              position: "absolute",
              bottom: "5%", right: "0%",
              width: 220, height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168,144,120,0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 0,
            }} />

            {/* Orb */}
            <motion.div
              variants={orbVariants}
              initial="hidden"
              animate="visible"
              className="absolute z-10 -bottom-12 -right-16 lg:-bottom-8 lg:-right-12 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px]"
            >
              <motion.div
                animate={{ y: [-12, 12, -12] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {/* Orb shadow cast */}
                <motion.div
                  animate={{ scaleX: [1, 0.85, 1], opacity: [0.18, 0.28, 0.18] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    bottom: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "75%",
                    height: 28,
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
                    filter: "blur(8px)",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
                />

                <motion.div
                  drag
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  dragElastic={0.4}
                  onDragStart={() => setIsOrbDragging(true)}
                  onDragEnd={() => setIsOrbDragging(false)}
                  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                  dragTransition={{ bounceStiffness: 120, bounceDamping: 12 }}
                  className="relative w-full h-full rounded-full cursor-grab
                    bg-[radial-gradient(circle_at_28%_28%,#ffffff_0%,rgba(250,245,235,0.95)_18%,rgba(225,215,200,0.85)_50%,rgba(195,180,160,0.9)_100%)]
                    dark:bg-[radial-gradient(circle_at_28%_28%,rgba(160,145,120,0.95)_0%,rgba(110,100,85,0.9)_18%,rgba(75,68,58,0.85)_50%,rgba(50,45,38,0.9)_100%)]
                    shadow-[inset_-20px_-20px_45px_rgba(0,0,0,0.08),inset_14px_14px_40px_rgba(255,255,255,0.95),20px_30px_50px_rgba(0,0,0,0.15)]
                    dark:shadow-[inset_-15px_-15px_40px_rgba(0,0,0,0.3),inset_12px_12px_35px_rgba(255,255,255,0.2),25px_35px_60px_rgba(0,0,0,0.4)]"
                >
                  <div className="absolute top-[10%] left-[12%] w-[30%] h-[30%] bg-white/35 dark:bg-white/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute top-[20%] left-[20%] w-[15%] h-[15%] bg-white/50 dark:bg-white/25 rounded-full blur-lg pointer-events-none" />

                  {/* Floating ring around orb */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: "absolute",
                      inset: -12,
                      borderRadius: "50%",
                      border: "1.5px dashed rgba(168,144,120,0.25)",
                      pointerEvents: "none",
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: "absolute",
                      inset: -24,
                      borderRadius: "50%",
                      border: "1px dashed rgba(212,175,55,0.15)",
                      pointerEvents: "none",
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Glass Card */}
            <motion.div
              ref={cardRef}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 800 }}
              drag
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0.25}
              whileDrag={{ scale: 1.02, rotate: -2, cursor: "grabbing" }}
              dragTransition={{ bounceStiffness: 150, bounceDamping: 15 }}
              className="relative z-30 w-[260px] sm:w-[290px] lg:w-[310px] rounded-[24px] border border-white/60 dark:border-white/10 bg-white/50 dark:bg-[#1a1a1a]/70 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.07),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] cursor-grab overflow-hidden"
            >
              {/* Scanline overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />

              {/* Specular tilt highlight */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 55%)",
                  pointerEvents: "none",
                  zIndex: 11,
                  transform: "translateZ(1px)",
                }}
              />

              {/* Corner accent lines */}
              <div style={{ position: "absolute", top: 12, left: 12, width: 18, height: 18, borderTop: "1.5px solid rgba(168,144,120,0.4)", borderLeft: "1.5px solid rgba(168,144,120,0.4)", borderRadius: "3px 0 0 0", pointerEvents: "none", zIndex: 12 }} />
              <div style={{ position: "absolute", top: 12, right: 12, width: 18, height: 18, borderTop: "1.5px solid rgba(168,144,120,0.4)", borderRight: "1.5px solid rgba(168,144,120,0.4)", borderRadius: "0 3px 0 0", pointerEvents: "none", zIndex: 12 }} />
              <div style={{ position: "absolute", bottom: 12, left: 12, width: 18, height: 18, borderBottom: "1.5px solid rgba(168,144,120,0.4)", borderLeft: "1.5px solid rgba(168,144,120,0.4)", borderRadius: "0 0 0 3px", pointerEvents: "none", zIndex: 12 }} />
              <div style={{ position: "absolute", bottom: 12, right: 12, width: 18, height: 18, borderBottom: "1.5px solid rgba(168,144,120,0.4)", borderRight: "1.5px solid rgba(168,144,120,0.4)", borderRadius: "0 0 3px 0", pointerEvents: "none", zIndex: 12 }} />

              {/* Header row */}
              <div className="flex items-center justify-between mb-5" style={{ position: "relative", zIndex: 5 }}>
                <p className="text-[12px] font-medium text-[#1C1C1C]/40 dark:text-[#888] tracking-wide">Currently Building...</p>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }}
                  />
                  <span className="text-[10px] font-semibold text-[#4ade80]/80 tracking-wider uppercase">Live</span>
                </div>
              </div>

              {/* Avatar stack */}
              <div className="flex gap-2 mb-5" style={{ position: "relative", zIndex: 5 }}>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C]/5 dark:bg-white/5 border border-[#1C1C1C]/10 dark:border-white/10 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-[#1C1C1C]/85 dark:bg-[#F3F3F3]/80 rounded-[3px]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-400/10 border border-orange-400/20 flex items-center justify-center">
                  <div className="w-3 h-3 border-[1.5px] border-orange-400 rounded-full" />
                </div>
              </div>

              <h4 className="text-[22px] font-bold text-[#1C1C1C] dark:text-[#F3F3F3] mb-4 font-serif" style={{ position: "relative", zIndex: 5 }}>
                Software Engineer
              </h4>

              {/* Typewriter code block */}
              <div
                className="w-full rounded-xl bg-[#f2ede4]/70 dark:bg-[#0d0d0d]/95 border border-white/40 dark:border-white/5 p-4 font-mono text-[12px] text-[#1C1C1C]/75 dark:text-[#C8C8C8] mb-4 shadow-inner leading-relaxed"
                style={{ minHeight: 88, position: "relative", zIndex: 5 }}
              >
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                </div>
                <p>
                  {typedLines[0].startsWith("function") ? (
                    <>
                      <span className="text-[#a89078]">function</span>
                      <span className="text-[#6b5a4e] dark:text-[#d4af37]">{typedLines[0].slice("function".length)}</span>
                    </>
                  ) : <span>{typedLines[0]}</span>}
                  {typedLines[0] && !typedLines[1] && (
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
                      style={{ display: "inline-block", width: 2, height: "1em", background: "currentColor", marginLeft: 1, verticalAlign: "middle" }} />
                  )}
                </p>
                {typedLines[1] && (
                  <p className="pl-4">
                    {typedLines[1].trim().startsWith("return") ? (
                      <>
                        <span className="text-[#a89078]">{"  return"}</span>
                        <span className="text-[#2d5a27] dark:text-[#4ade80]">{typedLines[1].slice(typedLines[1].indexOf("return") + "return".length)}</span>
                      </>
                    ) : <span>{typedLines[1]}</span>}
                    {!typedLines[2] && (
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
                        style={{ display: "inline-block", width: 2, height: "1em", background: "currentColor", marginLeft: 1, verticalAlign: "middle" }} />
                    )}
                  </p>
                )}
                {typedLines[2] && (
                  <p>
                    {typedLines[2]}
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
                      style={{ display: "inline-block", width: 2, height: "1em", background: "currentColor", marginLeft: 1, verticalAlign: "middle" }} />
                  </p>
                )}
              </div>

              {/* Stack pills */}
              <div className="flex items-center gap-2 flex-wrap" style={{ position: "relative", zIndex: 5 }}>
                {["React", "Node.js", "AWS"].map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.1, y: -2 }}
                    style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                      padding: "3px 10px", borderRadius: 999,
                      border: "1px solid rgba(168,144,120,0.25)",
                      background: "rgba(168,144,120,0.06)",
                      color: "#a89078", cursor: "default", textTransform: "uppercase",
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </GradientBackground>
    </section>
  );
}