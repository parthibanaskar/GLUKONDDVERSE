'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { useCapo } from '@/context/CapoContext';
import AppImage from '@/components/ui/AppImage';
import SectionLabel from '@/components/ui/SectionLabel';
import ActiveRadar from '@/app/components/ActiveRadar';

const HERO_LINES = ['EXISTING,', 'BUT MAKE IT', 'CINEMATIC.'];

export default function HeroSection() {
  const { fretConfig, activeFret } = useCapo();
  const containerRef = useRef<HTMLElement>(null);
  const heroInView = useInView(containerRef, { once: true, margin: '-10%' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const isMono = activeFret === 0;
  const isBrute = activeFret === 3;

  const headlineFont = isMono ? 'var(--font-jetbrains-mono)' : 'var(--font-heading)';
  const headlineWeight = isBrute ? 900 : isMono ? 700 : 900;

  const themeFilters: Record<number, string> = {
    0: 'sepia(1) hue-rotate(15deg) saturate(3) brightness(1.8) contrast(1.1)',
    1: 'sepia(1) hue-rotate(335deg) saturate(3.8) brightness(1.8) contrast(1.2)',
    2: 'sepia(1) hue-rotate(95deg) saturate(3.2) brightness(1.8) contrast(1.15)',
    3: 'brightness(1.55) contrast(0.95) saturate(1.1)',
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-24 md:pt-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
      style={{ background: fretConfig.bg }}
    >
      {activeFret === 0 && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-12 lg:gap-8 items-center min-h-[calc(100vh-100px)]">
        <div className="flex flex-col justify-center py-12 lg:py-0">
          <SectionLabel
            label="MISSION BRIEF"
            isInView={heroInView}
            accent={fretConfig.accent}
            className="mb-8"
          />

          <div className="overflow-hidden">
            {HERO_LINES.map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.h1
                  className="text-hero"
                  style={{
                    fontFamily: headlineFont,
                    fontWeight: headlineWeight,
                    color: isBrute ? '#000000' : '#ffffff',
                    fontStyle: 'normal',
                    letterSpacing: isBrute ? '-0.10em' : '-0.03em',
                    lineHeight: '0.85',
                  }}
                  initial={{ y: '110%' }}
                  animate={heroInView ? { y: 0 } : {}}
                  transition={{ delay: 0.7 + i * 0.12, type: 'spring', stiffness: 90, damping: 18 }}
                >
                  <span
                    className={i === 1 ? 'whitespace-nowrap' : ''}
                    style={i === 2 ? { color: fretConfig.accent, WebkitTextStroke: 'none' } : {}}
                  >
                    {line}
                  </span>
                </motion.h1>
              </div>
            ))}
          </div>

          <motion.div
            className="mt-8 mb-6"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.1 }}
          >
            <span
              className="font-serif text-display"
              style={{
                fontFamily: isMono ? 'var(--font-jetbrains-mono)' : 'var(--font-fraunces)',
                color: fretConfig.accent,
                fontStyle: 'normal',
                fontWeight: 300,
              }}
            >
              PARTHIBA
            </span>
          </motion.div>

          {/* TypewriterEffect */}

          <motion.div
            className="flex flex-wrap gap-3 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }}
          >
            {['Human //', 'Web Developer //', 'Musician //', 'Visual Storyteller'].map((tag, i) => (
              <motion.span
                key={tag}
                className="font-mono text-[11px] tracking-[0.2em] uppercase"
                style={{
                  color: i === 0 ? (isBrute ? '#000000' : '#ffffff') : fretConfig.accent,
                  opacity: i === 0 ? 0.5 : 1,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={heroInView ? { opacity: i === 0 ? 0.5 : 1, x: 0 } : {}}
                transition={{ delay: 1.3 + i * 0.08 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <Link
              href="/career"
              className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase px-6 py-4 sm:py-3 border transition-all w-full sm:w-auto text-center"
              style={{
                background: fretConfig.accent,
                color: activeFret === 3 ? '#ffffff' : '#000000',
                borderColor: fretConfig.accent,
              }}
            >
              VIEW CAREER
            </Link>
            <Link
              href="/about"
              className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase px-6 py-4 sm:py-3 border transition-all w-full sm:w-auto text-center"
              style={{
                background: 'transparent',
                color: isBrute ? '#000000' : '#ffffff',
                borderColor: isBrute ? '#000000' : 'rgba(255,255,255,0.3)',
              }}
            >
              ABOUT ME
            </Link>
          </motion.div>
        </div>

        <div className="relative flex flex-col items-center gap-6 py-8 lg:py-0">
          <motion.div
            className="relative w-full max-w-sm mx-auto"
            style={{ y: portraitY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, type: 'spring', stiffness: 120, damping: 24 }}
          >
            <div
              className="aspect-portrait w-full relative overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                border: activeFret === 3 ? '2px solid #000000' : `1px solid ${fretConfig.accent}30`,
                filter: themeFilters[activeFret] || 'none',
              }}
            >
              <AppImage
                src="/images/hero-ab.jpg"
                alt="Parthiba"
                fill
                className="object-cover object-top"
                priority
                quality={100}
              />

              {activeFret !== 3 && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${fretConfig.bg} 0%, transparent 50%)`,
                  }}
                />
              )}

              {activeFret === 0 && (
                <>
                  <div
                    className="absolute top-2 left-2 w-6 h-6 border-t border-l"
                    style={{ borderColor: fretConfig.accent }}
                  />
                  <div
                    className="absolute top-2 right-2 w-6 h-6 border-t border-r"
                    style={{ borderColor: fretConfig.accent }}
                  />
                  <div
                    className="absolute bottom-2 left-2 w-6 h-6 border-b border-l"
                    style={{ borderColor: fretConfig.accent }}
                  />
                  <div
                    className="absolute bottom-2 right-2 w-6 h-6 border-b border-r"
                    style={{ borderColor: fretConfig.accent }}
                  />
                </>
              )}
              {activeFret === 2 && (
                <div
                  className="absolute bottom-3 left-3 font-mono text-[9px] tracking-widest"
                  style={{ color: '#ffffff', opacity: 0.5 }}
                ></div>
              )}
            </div>

            <motion.div
              className="absolute -bottom-12 -left-0.2 px-4 py-2 border"
              style={{ background: fretConfig.bg, borderColor: fretConfig.accent }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="font-mono text-[10px] tracking-[0.3em] uppercase"
                style={{ color: fretConfig.accent }}
              >
                KOLKATA ✈️ AGARTALA
              </span>
            </motion.div>
          </motion.div>

          <div className="mt-20 lg:mt-25 w-full flex justify-center">
            <ActiveRadar />
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase"
          style={{ color: fretConfig.accent, opacity: 0.4 }}
        >
          SCROLL
        </span>
        <div
          className="w-px h-8"
          style={{ background: `linear-gradient(to bottom, ${fretConfig.accent}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}
