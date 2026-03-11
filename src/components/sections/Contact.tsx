"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import {
  contactSchema,
  SUBJECT_OPTIONS,
} from "@/lib/contact-schema";

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  fullName?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  agreement?: string;
}

// ═══════════════════════════════════════
// RADIAL BURST CANVAS — Left panel
// ═══════════════════════════════════════

function RadialCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Ring system
    const rings = Array.from({ length: 6 }, (_, i) => ({
      baseR: 60 + i * 70,
      phase: (i * Math.PI) / 3,
      speed: 0.003 + i * 0.0008,
      dashCount: 6 + i * 4,
      dashLen: 0.12 - i * 0.01,
    }));

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: 40 + Math.random() * 350,
      speed: (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1),
      size: 0.8 + Math.random() * 1.6,
      opacity: 0.15 + Math.random() * 0.35,
      pulse: Math.random() * Math.PI * 2,
    }));

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -1, y: -1 }; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const cx = W * 0.42;
      const cy = H * 0.52;
      const gold = [198, 169, 105] as const;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasMouse = mx >= 0;
      const mouseDist = hasMouse ? Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2) : 999;
      const mouseInfluence = hasMouse ? Math.max(0, 1 - mouseDist / 400) : 0;

      // Deep center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280 + mouseInfluence * 80);
      glow.addColorStop(0, `rgba(${gold.join(",")}, ${0.12 + mouseInfluence * 0.1})`);
      glow.addColorStop(0.4, `rgba(${gold.join(",")}, 0.04)`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Dashed rotating rings
      rings.forEach((ring, ri) => {
        const r = ring.baseR + Math.sin(t * 0.0008 + ring.phase) * 8 + mouseInfluence * 20;
        const alpha = 0.08 + mouseInfluence * 0.1 + (ri === 2 ? 0.06 : 0);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * ring.speed);
        ctx.strokeStyle = `rgba(${gold.join(",")}, ${alpha})`;
        ctx.lineWidth = ri === 2 ? 0.8 : 0.5;
        const arcLen = (Math.PI * 2) / ring.dashCount;
        for (let d = 0; d < ring.dashCount; d++) {
          const startA = d * arcLen;
          const endA = startA + arcLen * ring.dashLen;
          ctx.beginPath();
          ctx.arc(0, 0, r, startA, endA);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Central crosshair
      const chAlpha = 0.08 + mouseInfluence * 0.08;
      ctx.strokeStyle = `rgba(${gold.join(",")}, ${chAlpha})`;
      ctx.lineWidth = 0.5;
      [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30);
        ctx.lineTo(cx + Math.cos(a) * 340, cy + Math.sin(a) * 340);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a + Math.PI) * 30, cy + Math.sin(a + Math.PI) * 30);
        ctx.lineTo(cx + Math.cos(a + Math.PI) * 340, cy + Math.sin(a + Math.PI) * 340);
        ctx.stroke();
      });

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${gold.join(",")}, ${0.3 + mouseInfluence * 0.3})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${gold.join(",")}, ${0.12 + mouseInfluence * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Orbiting particles
      particles.forEach((p) => {
        p.angle += p.speed;
        p.pulse += 0.018;
        const px = cx + Math.cos(p.angle) * p.r;
        const py = cy + Math.sin(p.angle) * p.r;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        const a = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gold.join(",")}, ${a})`;
        ctx.fill();

        // Line to center
        if (p.r < 180) {
          const lineA = (p.r < 100 ? 0.04 : 0.02) * (0.7 + Math.sin(p.pulse) * 0.3);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(${gold.join(",")}, ${lineA})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      });

      // Mouse proximity aura
      if (hasMouse && mouseDist < 300) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        aura.addColorStop(0, `rgba(${gold.join(",")}, 0.06)`);
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ═══════════════════════════════════════
// LEFT PANEL CONTENT
// ═══════════════════════════════════════

function LeftPanelContent() {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div
      ref={ref}
      className="relative z-10 flex flex-col justify-between h-full py-14 lg:py-20 px-10 lg:px-16"
    >
      {/* Signal pill */}
      <motion.div
        custom={0} variants={fadeIn} initial="hidden" animate={controls}
        className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full
          border border-[#C6A969]/20 bg-[#C6A969]/5"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A969] opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C6A969]" />
        </span>
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#C6A969] font-medium"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          Line Open
        </span>
      </motion.div>

      {/* Main text */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <motion.div custom={1} variants={fadeIn} initial="hidden" animate={controls}>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C6A969]/50 mb-5"
            style={{ fontFamily: "'DM Mono', monospace" }}>
            — COMM.PORT.01
          </p>
          <h2
            className="text-[clamp(2.6rem,5.5vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.05em]
              text-[#1C1C1C] dark:text-[#F3F3F3]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Let's
            <br />
            <em className="not-italic relative inline-block">
              <span className="bg-gradient-to-br from-[#C6A969] via-[#e2c97e] to-[#a07c3a] bg-clip-text text-transparent">
                Connect.
              </span>
              {/* Underline accent */}
              <motion.div
                className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#C6A969] to-transparent"
                initial={{ width: "0%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </em>
          </h2>
        </motion.div>

        <motion.p
          custom={2} variants={fadeIn} initial="hidden" animate={controls}
          className="text-[12.5px] leading-[1.9] text-[#1C1C1C]/40 dark:text-[#F3F3F3]/35 max-w-[280px]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Precision-crafted digital experiences.
          <br />
          Direct line to the engineer.
        </motion.p>

        {/* Status grid */}
        <motion.div
          custom={3} variants={fadeIn} initial="hidden" animate={controls}
          className="grid grid-cols-3 gap-px overflow-hidden rounded-xl
            border border-[#C6A969]/10 bg-[#C6A969]/10"
        >
          {[
            { label: "Response", value: "< 24h" },
            { label: "Status", value: "Open" },
            { label: "Layer", value: "TLS 1.3" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center py-4 px-3
                bg-[#F5EFE6] dark:bg-[#111111] gap-1.5"
            >
              <span
                className="text-[15px] font-semibold tracking-[-0.02em] text-[#C6A969]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.value}
              </span>
              <span
                className="text-[9px] tracking-[0.18em] uppercase text-[#1C1C1C]/30 dark:text-[#F3F3F3]/25"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer stamp */}
      <motion.div
        custom={4} variants={fadeIn} initial="hidden" animate={controls}
        className="flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-[#C6A969]/10" />
        <span
          className="text-[9px] tracking-[0.2em] uppercase text-[#1C1C1C]/15 dark:text-[#F3F3F3]/12"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          SECURE v1
        </span>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════
// FLOATING LABEL INPUT
// ═══════════════════════════════════════

function FormInput({
  label, name, type = "text", required = false,
  value, error, onChange, placeholder,
}: {
  label: string; name: string; type?: string; required?: boolean;
  value: string; error?: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      {/* Floating label container */}
      <div className={`
        relative rounded-xl overflow-hidden transition-all duration-300
        ${error
          ? "ring-1 ring-red-400/40"
          : focused
            ? "ring-1 ring-[#C6A969]/50 shadow-[0_0_0_3px_rgba(198,169,105,0.08)]"
            : "ring-1 ring-[#1C1C1C]/6 dark:ring-[#F3F3F3]/6"
        }
        bg-[#EDE5D8]/50 dark:bg-[#1a1a1a]/60
      `}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          autoComplete="off"
          className={`
            w-full bg-transparent px-4 pb-3 text-[13.5px] outline-none
            text-[#1C1C1C] dark:text-[#F3F3F3]
            placeholder:text-[#1C1C1C]/20 dark:placeholder:text-[#F3F3F3]/15
            transition-all duration-200
            ${active ? "pt-6" : "pt-4"}
          `}
          style={{ fontFamily: "'DM Mono', monospace" }}
        />
        {/* Floating label */}
        <label
          htmlFor={name}
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 select-none
            ${active
              ? "top-2 text-[9px] tracking-[0.22em] text-[#C6A969]"
              : "top-1/2 -translate-y-1/2 text-[11px] tracking-[0.15em] text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30"
            }
          `}
          style={{ fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}
        >
          {label}{required && <span className="text-[#C6A969]/60 ml-0.5">*</span>}
        </label>
        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C6A969] via-[#e2c97e] to-[#C6A969]/0"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="text-[11px] mt-1.5 px-1 text-red-400/70"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// CUSTOM DROPDOWN
// ═══════════════════════════════════════

function CustomDropdown({
  label, name, required = false, value, error, onChange, options,
}: {
  label: string; name: string; required?: boolean; value: string;
  error?: string; onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label || "";
  const active = focused || open || !!selectedLabel;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className={`
        relative rounded-xl overflow-visible transition-all duration-300
        ${error
          ? "ring-1 ring-red-400/40"
          : open || focused
            ? "ring-1 ring-[#C6A969]/50 shadow-[0_0_0_3px_rgba(198,169,105,0.08)]"
            : "ring-1 ring-[#1C1C1C]/6 dark:ring-[#F3F3F3]/6"
        }
        bg-[#EDE5D8]/50 dark:bg-[#1a1a1a]/60 rounded-xl
      `}>
        <button
          type="button"
          onClick={() => { setOpen(!open); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!open) setFocused(false); }}
          className={`
            w-full bg-transparent px-4 pb-3 text-left text-[13.5px] outline-none
            flex items-center justify-between cursor-pointer rounded-xl
            transition-all duration-200
            ${active ? "pt-6" : "pt-4"}
          `}
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          <span className={selectedLabel ? "text-[#1C1C1C] dark:text-[#F3F3F3]" : "text-transparent"}>
            {selectedLabel || "placeholder"}
          </span>
          <motion.svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22 }}
            className="text-[#C6A969]/50 flex-shrink-0"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>

        {/* Floating label */}
        <label
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 select-none
            ${active
              ? "top-2 text-[9px] tracking-[0.22em] text-[#C6A969]"
              : "top-1/2 -translate-y-1/2 text-[11px] tracking-[0.15em] text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30"
            }
          `}
          style={{ fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}
        >
          {label}{required && <span className="text-[#C6A969]/60 ml-0.5">*</span>}
        </label>

        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-b-xl bg-gradient-to-r from-[#C6A969] via-[#e2c97e] to-[#C6A969]/0"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: open || focused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Hidden native select */}
      <select name={name} value={value} onChange={(e) => onChange(e.target.value)}
        tabIndex={-1} aria-hidden className="sr-only">
        <option value="" />
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 z-50 origin-top rounded-xl overflow-hidden
              bg-[#F0E8D8] dark:bg-[#1e1e1e]
              ring-1 ring-[#C6A969]/15
              shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt.value}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { onChange(opt.value); setOpen(false); setFocused(false); }}
                className={`
                  w-full text-left px-4 py-3 text-[12.5px] cursor-pointer
                  flex items-center gap-3 transition-colors duration-150
                  ${value === opt.value
                    ? "bg-[#C6A969]/15 text-[#C6A969]"
                    : "text-[#1C1C1C]/60 dark:text-[#F3F3F3]/50 hover:bg-[#C6A969]/8"
                  }
                `}
                style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em" }}
              >
                <span className={`w-1 h-1 rounded-full flex-shrink-0
                  ${value === opt.value ? "bg-[#C6A969]" : "bg-[#1C1C1C]/15 dark:bg-[#F3F3F3]/15"}`}
                />
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="text-[11px] mt-1.5 px-1 text-red-400/70"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// TEXTAREA
// ═══════════════════════════════════════

function FormTextarea({
  label, name, required = false, value, error, onChange, placeholder,
}: {
  label: string; name: string; required?: boolean;
  value: string; error?: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <div className={`
        relative rounded-xl transition-all duration-300
        ${error
          ? "ring-1 ring-red-400/40"
          : focused
            ? "ring-1 ring-[#C6A969]/50 shadow-[0_0_0_3px_rgba(198,169,105,0.08)]"
            : "ring-1 ring-[#1C1C1C]/6 dark:ring-[#F3F3F3]/6"
        }
        bg-[#EDE5D8]/50 dark:bg-[#1a1a1a]/60
      `}>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          rows={5}
          className={`
            w-full bg-transparent px-4 pb-3 text-[13.5px] resize-none outline-none
            text-[#1C1C1C] dark:text-[#F3F3F3]
            placeholder:text-[#1C1C1C]/20 dark:placeholder:text-[#F3F3F3]/15
            transition-all duration-200
            ${active ? "pt-7" : "pt-4"}
          `}
          style={{ fontFamily: "'DM Mono', monospace", minHeight: "130px" }}
        />
        <label
          htmlFor={name}
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 select-none
            ${active
              ? "top-2 text-[9px] tracking-[0.22em] text-[#C6A969]"
              : "top-4 text-[11px] tracking-[0.15em] text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30"
            }
          `}
          style={{ fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}
        >
          {label}{required && <span className="text-[#C6A969]/60 ml-0.5">*</span>}
        </label>
        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-b-xl bg-gradient-to-r from-[#C6A969] via-[#e2c97e] to-[#C6A969]/0"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Character count */}
        <div
          className="absolute bottom-3 right-4 text-[10px] tabular-nums text-[#1C1C1C]/20 dark:text-[#F3F3F3]/15 pointer-events-none"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {value.length}/1000
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="text-[11px] mt-1.5 px-1 text-red-400/70"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// SUBMIT BUTTON
// ═══════════════════════════════════════

function SubmitButton({ status, disabled }: { status: FormStatus; disabled: boolean }) {
  const [hovered, setHovered] = useState(false);

  const label = useMemo(() => {
    switch (status) {
      case "submitting": return "Transmitting";
      case "success": return "Received";
      default: return "Send Message";
    }
  }, [status]);

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={`
        relative group inline-flex items-center justify-center gap-3
        h-14 px-10 rounded-2xl overflow-hidden cursor-pointer
        transition-[opacity] duration-300
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {/* Background layers */}
      <div className="absolute inset-0 rounded-2xl bg-[#1C1C1C]/5 dark:bg-[#F3F3F3]/5 border border-[#C6A969]/20" />
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C6A969] via-[#d4b96a] to-[#a07c3a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Shimmer */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            }}
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Progress bar for submitting */}
      {status === "submitting" && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-[#C6A969]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      )}

      {/* Text */}
      <span
        className={`relative z-10 text-[11.5px] tracking-[0.16em] uppercase font-semibold transition-colors duration-300
          ${hovered ? "text-[#111]" : "text-[#1C1C1C] dark:text-[#F3F3F3]"}`}
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {status === "success" ? "✓ " : ""}{label}
      </span>

      {/* Arrow / spinner */}
      {status === "idle" && (
        <motion.span
          className={`relative z-10 text-[16px] leading-none transition-colors duration-300
            ${hovered ? "text-[#111]" : "text-[#C6A969]"}`}
          animate={hovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          ↗
        </motion.span>
      )}
      {status === "submitting" && (
        <motion.span
          className="relative z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="text-[#1C1C1C] dark:text-[#F3F3F3]">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"
              strokeDasharray="20 12" strokeLinecap="round" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════
// SUCCESS STATE
// ═══════════════════════════════════════

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Animated ring burst */}
      <div className="relative mb-10 flex items-center justify-center w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#C6A969]/20"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1 + i * 0.4, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, ease: "easeOut" }}
            style={{ width: "100%", height: "100%" }}
          />
        ))}
        <motion.div
          className="relative z-10 w-16 h-16 rounded-full
            bg-gradient-to-br from-[#C6A969]/20 to-[#C6A969]/5
            border border-[#C6A969]/30 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        >
          <motion.svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <motion.path
              d="M6 13.5L11.5 19L20 8"
              stroke="#C6A969"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <h3
        className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.03em]
          text-[#1C1C1C] dark:text-[#F3F3F3] mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Message Received.
      </h3>
      <p
        className="text-[12px] tracking-[0.04em] leading-[1.85]
          text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30 max-w-[280px]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Transmission successful.
        <br />
        Response within 24–48 hours.
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// MAIN CONTACT COMPONENT
// ═══════════════════════════════════════

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-40px" });
  const controls = useAnimation();

  const [formData, setFormData] = useState({
    fullName: "", email: "", company: "",
    subject: "", message: "", agreement: false, _hp: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const updateField = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => { const n = { ...prev }; delete n[field as keyof FieldErrors]; return n; });
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setServerError("");
      const result = contactSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        result.error.errors.forEach((err) => {
          const field = err.path[0] as keyof FieldErrors;
          if (!fieldErrors[field]) fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      setStatus("submitting");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.errors) { setErrors(data.errors); setStatus("idle"); }
          else { setServerError(data.message || "Something went wrong."); setStatus("error"); }
          return;
        }
        setStatus("success");
        setFormData({ fullName: "", email: "", company: "", subject: "", message: "", agreement: false, _hp: "" });
      } catch {
        setServerError("Network error. Please try again.");
        setStatus("error");
      }
    },
    [formData]
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#F5EFE6] dark:bg-[#111111] transition-colors duration-500"
    >
      {/* Top separator */}
      <div
        className="absolute top-0 inset-x-0 h-px z-20 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(198,169,105,0.35) 50%, transparent)" }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* ─────────────────────────────────── */}
        {/* LEFT PANEL                          */}
        {/* ─────────────────────────────────── */}
        <div className="relative w-full lg:w-[48%] min-h-[55vh] lg:min-h-screen overflow-hidden">
          {/* Subtle warm tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A969]/4 via-transparent to-transparent pointer-events-none z-0" />

          <RadialCanvas />
          <LeftPanelContent />

          {/* Right divider */}
          <div
            className="absolute right-0 top-0 bottom-0 w-px hidden lg:block pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 5%, rgba(198,169,105,0.18) 25%, rgba(198,169,105,0.18) 75%, transparent 95%)",
            }}
          />
        </div>

        {/* ─────────────────────────────────── */}
        {/* RIGHT FORM PANEL                    */}
        {/* ─────────────────────────────────── */}
        <div className="relative w-full lg:w-[52%] flex items-center justify-center
          px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-0">

          {/* Soft bg glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(198,169,105,0.04) 0%, transparent 70%)",
            }}
          />

          <div className="w-full max-w-[490px]">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <SuccessState key="success" />
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  {/* Header */}
                  <motion.div
                    custom={0} variants={fadeUp} initial="hidden" animate={controls}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <div className="h-[1.5px] w-5 bg-gradient-to-r from-transparent to-[#C6A969]" />
                      <span
                        className="text-[10px] tracking-[0.24em] uppercase text-[#C6A969]/70"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        Direct Contact
                      </span>
                    </div>
                    <h2
                      className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.0] tracking-[-0.04em]
                        text-[#1C1C1C] dark:text-[#F3F3F3] mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Start a
                      <br />
                      <span className="text-[#C6A969]">Conversation.</span>
                    </h2>
                    <p
                      className="text-[12px] tracking-[0.03em] leading-[1.8]
                        text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      Serious inquiries only. Clear context preferred.
                    </p>
                  </motion.div>

                  {/* Fields */}
                  <motion.div
                    custom={1} variants={fadeUp} initial="hidden" animate={controls}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput label="Full Name" name="fullName" required
                        value={formData.fullName} error={errors.fullName}
                        onChange={(v) => updateField("fullName", v)} placeholder="John Doe" />
                      <FormInput label="Email" name="email" type="email" required
                        value={formData.email} error={errors.email}
                        onChange={(v) => updateField("email", v)} placeholder="john@company.com" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput label="Company" name="company"
                        value={formData.company} error={errors.company}
                        onChange={(v) => updateField("company", v)} placeholder="Optional" />
                      <CustomDropdown label="Subject" name="subject" required
                        value={formData.subject} error={errors.subject}
                        onChange={(v) => updateField("subject", v)} options={SUBJECT_OPTIONS} />
                    </div>

                    <FormTextarea label="Message" name="message" required
                      value={formData.message} error={errors.message}
                      onChange={(v) => updateField("message", v)}
                      placeholder="Describe your project, opportunity, or inquiry..." />

                    {/* Honeypot */}
                    <input type="text" name="_hp" value={formData._hp}
                      onChange={(e) => updateField("_hp", e.target.value)}
                      tabIndex={-1} autoComplete="off" aria-hidden="true"
                      style={{ position: "absolute", left: "-9999px", width: 0, height: 0, opacity: 0 }}
                    />

                    {/* Agreement */}
                    <label className="flex items-start gap-3 cursor-pointer group pt-1">
                      <div className="relative mt-0.5 flex-shrink-0">
                        <input type="checkbox" checked={formData.agreement}
                          onChange={(e) => updateField("agreement", e.target.checked)}
                          className="sr-only" />
                        <div className={`
                          w-4 h-4 rounded-[4px] border-[1.5px] transition-all duration-200
                          flex items-center justify-center
                          ${formData.agreement
                            ? "bg-[#C6A969] border-[#C6A969]"
                            : "border-[#1C1C1C]/15 dark:border-[#F3F3F3]/15 group-hover:border-[#C6A969]/40"
                          }
                        `}>
                          {formData.agreement && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2.5 5L4.5 7L7.5 3" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span
                        className="text-[11px] tracking-[0.03em] leading-[1.6]
                          text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        I agree to professional communication only
                      </span>
                    </label>
                    {errors.agreement && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-red-400/70 -mt-2 px-1"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        ↳ {errors.agreement}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Server error */}
                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-5 px-4 py-3 rounded-xl border border-red-400/15 bg-red-400/5"
                      >
                        <p className="text-[12px] text-red-400/70"
                          style={{ fontFamily: "'DM Mono', monospace" }}>
                          {serverError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit row */}
                  <motion.div
                    custom={2} variants={fadeUp} initial="hidden" animate={controls}
                    className="pt-8 flex items-center gap-5"
                  >
                    <SubmitButton status={status} disabled={status === "submitting"} />
                    <span
                      className="text-[10px] tracking-[0.1em] text-[#1C1C1C]/20 dark:text-[#F3F3F3]/15"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      End-to-end encrypted
                    </span>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom stamp */}
      <div
        className="absolute bottom-5 right-6 hidden sm:block text-[9px] tracking-[0.15em] uppercase
          text-[#1C1C1C]/10 dark:text-[#F3F3F3]/8 pointer-events-none select-none z-20"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        COMM.PORT — SECURE.v1
      </div>

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(198,169,105,0.18) 50%, transparent)" }}
      />
    </section>
  );
}