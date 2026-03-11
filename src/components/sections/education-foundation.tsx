// components/EducationFoundation.tsx
'use client';

import { motion } from 'framer-motion';

export default function EducationFoundation() {
  return (
    <div className="relative transition-colors duration-500 font-serif">
      <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-36 px-5 md:px-10 lg:px-16">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Divider with gradient to blend sections */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent z-10" />
          
          {/* Blueprint dots */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.08)_1px,transparent_1px)] bg-[length:32px_32px] dark:bg-[radial-gradient(circle,rgba(180,120,20,0.09)_1px,transparent_1px)]" />
          {/* Blueprint lines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[length:32px_32px]" />
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        </div>

        {/* Large watermark text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-30 dark:opacity-15">
          <span className="font-black text-[min(22vw,220px)] leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_theme(colors.border)]">
            FOUNDATION
          </span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          {/* Header */}
          <header className="text-center mb-16 md:mb-24">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent mb-4 animate-fade-in-up">
              Foundation
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-foreground animate-fade-in-up animation-delay-200">
              Engineering{' '}
              <em className="not-italic bg-gradient-to-br from-accent via-accent/80 to-accent bg-clip-text text-transparent">
                Education
              </em>
            </h1>

            <p className="mt-6 font-mono text-sm text-muted-foreground/80 max-w-md mx-auto animate-fade-in animation-delay-400">
              Academic foundations that shaped my engineering thinking.
            </p>

            <div className="mt-8 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-border to-transparent animate-fade-in animation-delay-500" />
          </header>

          {/* Timeline stem + node */}
          <div className="flex flex-col items-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground/60 animate-fade-in animation-delay-600">
              EDUCATION
            </p>

            <div className="h-16 md:h-20 w-px bg-gradient-to-b from-transparent to-accent/60 animate-grow-vertical animation-delay-700" />

            <div className="relative size-6">
              <div className="absolute inset-0 rounded-full bg-accent/20 scale-75 animate-node-in" />
              <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-[0_0_12px_rgba(212,175,55,0.75)] outline outline-2 outline-accent/40 outline-offset-2 scale-75 animate-node-in animation-delay-100" />
            </div>

            <div className="h-16 md:h-20 w-px bg-gradient-to-t from-transparent to-accent/60 animate-grow-vertical animation-delay-900" />

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.4 } }}
              className={`
                group relative w-full max-w-2xl mt-8 rounded-3xl overflow-hidden p-8 md:p-10
                bg-secondary/30 backdrop-blur-2xl border border-glass-border
                shadow-[0_4px_60px_rgba(198,169,105,0.05),inset_0_1px_0_rgba(255,255,255,0.05)]
                hover:shadow-[0_12px_80px_rgba(198,169,105,0.1),0_0_0_1px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]
                transition-all duration-500
              `}
            >
              {/* Top specular line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 via-40% to-transparent opacity-80 pointer-events-none" />

              {/* Hover inner bloom */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-accent/8 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-accent/30 rounded-tl-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-accent/30 rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-accent/30 rounded-bl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-accent/30 rounded-br-3xl pointer-events-none" />

              {/* Bottom gold line on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/65 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />

              <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-14 items-start">
                {/* Left column */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-accent mb-1 animate-fade-in animation-delay-1000">
                    OIST · Bhopal, M.P.
                  </p>

                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight animate-fade-in animation-delay-1060">
                    Bachelor of Technology
                  </h3>

                  <p className="font-serif italic text-muted-foreground/80 mt-1.5 animate-fade-in animation-delay-1120">
                    Computer Science (AIML)
                  </p>

                  <p className="font-mono text-xs text-muted-foreground/60 mt-4 animate-fade-in animation-delay-1180">
                    Jul 2020 — Jun 2024
                  </p>

                  <div className="my-7 h-px bg-gradient-to-r from-border to-transparent w-2/3" />

                  <ul className="space-y-4 text-sm text-muted-foreground font-light font-mono">
                    {[
                      'Specialization in AI/ML alongside core computer science fundamentals',
                      'Systems thinking, algorithms, and full-stack backend development',
                      'Built production-ready web applications from sophomore year onward',
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + i * 0.1, duration: 0.6 }}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 rounded-full bg-accent/85 flex-shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2.5 mt-8">
                    {['Algorithms', 'System Design', 'Data Structures', 'Backend Dev', 'AI / ML'].map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.55 + i * 0.07, duration: 0.5 }}
                        className={`
                          px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-full
                          text-accent bg-accent/10 border border-accent/20
                        `}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Right column - CGPA */}
                <div className="flex flex-col items-center gap-3 animate-fade-in animation-delay-1250">
                  <div className="relative size-24">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        className="text-accent/15 dark:text-accent/10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="url(#goldArc)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray="264"
                        strokeDashoffset="264"
                        className="animate-[draw-arc_2s_cubic-bezier(0.22,1,0.36,1)_1.4s_forwards]"
                      />
                      <defs>
                        <linearGradient id="goldArc" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#C6A969" />
                          <stop offset="100%" stopColor="#d4b96a" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold bg-gradient-to-br from-accent to-accent/80 bg-clip-text text-transparent">
                        7.9
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/60 mt-0.5">
                        / 10
                      </span>
                    </div>
                  </div>

                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    CGPA
                  </p>
                </div>
              </div>

              {/* Footer full name */}
              <p className="mt-10 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground/50">
                Oriental Institute of Science and Technology
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}