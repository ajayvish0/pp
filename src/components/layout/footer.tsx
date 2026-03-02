// components/Footer.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { useRef } from 'react';
import type { Icon } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link'; // Next.js internal links

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.12,
      when: 'beforeChildren',
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const shimmer = {
  backgroundImage:
    'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 3.5s linear infinite',
};

const goldGradient =
  'bg-gradient-to-r from-[#a89078] to-[#d4af37] bg-clip-text text-transparent';

const Footer = () => {
  const ref = useRef<HTMLDivElement>(null);

const socialIcons = [
  { Icon: FaGithub, href: 'https://github.com/yourusername', label: 'GitHub' },
  { Icon: FaLinkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
  { Icon: FaTwitter, href: 'https://twitter.com/yourusername', label: 'Twitter' },
  { Icon: FaEnvelope, href: 'mailto:ajayvish936@gmail.com', label: 'Email' },
];

  const navigationItems = [
    { name: 'Work', href: '/work' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/experience' },
    { name: 'Contact', href: '/contact' },
    { name: 'Resume', href: '/resume' },
  ];

  return (
    <footer
      ref={ref}
      className="relative bg-ivory-light dark:bg-charcoal-dark pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg ... subtle grain texture here ...")',
        backgroundSize: '200px',
      }}
    >
      {/* Soft radial glow behind CTA */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-gold-500/10 via-transparent to-transparent blur-3xl opacity-60" />
      </div>

      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={footerVariants}
      >
        {/* 1. Large CTA Section */}
        <div className="text-center mb-20 md:mb-28">
          <motion.h2
            variants={headingVariants}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-10 ${goldGradient}`}
            style={{ WebkitBackgroundClip: 'text' }}
          >
            Let’s build systems that scale.
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6"
            variants={childVariants}
          >
            <motion.button
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="group relative px-10 py-5 rounded-2xl bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-neutral-700/30 shadow-lg overflow-hidden text-charcoal-dark dark:text-ivory-light font-medium text-lg"
            >
              <span className="relative z-10">Start a Conversation</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#a89078]/20 to-[#d4af37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-70"
                style={shimmer}
              />
            </motion.button>

            <Link href="/resume" >
              <motion.div
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ y: 0, scale: 0.98 }}
                className="px-10 py-5 rounded-2xl bg-transparent border-2 border-[#d4af37]/60 text-[#d4af37] font-medium text-lg hover:bg-[#d4af37]/10 transition-colors duration-300 inline-block text-center"
              >
                View Resume
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* 2. Main Footer Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12"
          variants={childVariants}
        >
          {/* Column 1 – Brand */}
          <div>
            <div
              className={`text-4xl md:text-5xl font-serif font-bold ${goldGradient} mb-4`}
            >
              AV
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 text-base leading-relaxed">
              Backend engineering focused on scalable, production-ready
              architecture and high-throughput systems.
            </p>
           <div className="flex gap-5">
  {socialIcons.map(({ Icon, href, label }, i) => (
    <motion.a
      key={i}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={label}
      whileHover={{ y: -6, scale: 1.15 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="text-neutral-600 dark:text-neutral-400 hover:text-[#d4af37] transition-colors"
    >
      <Icon size={28} />
    </motion.a>
  ))}
</div>
          </div>

          {/* Column 2 – Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal-dark dark:text-ivory-light mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              {navigationItems.map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link href={item.href} className="hover:text-[#d4af37] transition-colors group relative inline-block">
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#a89078] to-[#d4af37] group-hover:w-full transition-all duration-400" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Expertise */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal-dark dark:text-ivory-light mb-5">
              Expertise
            </h3>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              {[
                'Backend Architecture',
                'REST & API Design',
                'Performance Optimization',
                'Cloud Deployment',
                'Scalable CRM Systems',
              ].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 8, color: '#d4af37' }}
                  transition={{ type: 'spring', stiffness: 250 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Availability */}
          <div>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/40 dark:bg-neutral-900/30 backdrop-blur-xl border border-white/20 dark:border-neutral-700/30 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <p className="font-medium text-charcoal-dark dark:text-ivory-light">
                  Currently open to selective remote opportunities.
                </p>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Response time:{' '}
                <span className="text-[#d4af37]">less than 24 hours</span>
              </p>
              <a
                href="mailto:ajayvish936@gmail.com"
                className={`font-medium ${goldGradient} hover:underline`}
              >
                ajayvish936@gmail.com
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Optional copyright */}
      <div className="text-center mt-16 text-neutral-500 dark:text-neutral-600 text-sm">
        © {new Date().getFullYear()} AV — Crafted with precision.
      </div>
    </footer>
  );
};

export default Footer;