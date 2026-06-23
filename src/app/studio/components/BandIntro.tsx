'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';

import SpotifySection from './SpotifySection';

const BAND_MEMBERS = [
  {
    name: 'SOUMYADIPTYA',
    alias: 'THE GODFATHER',
    role: 'CO-FOUNDER / VOCALS / PRODUCER',
    tag: 'VOCALS',
  },
  {
    name: 'PARTHIBA',
    alias: 'PROF GLUKONDD',
    role: 'CO-FOUNDER / GUITAR / PRODUCER ',
    tag: 'GUITAR',
  },
  {
    name: 'ARUNAVO',
    alias: 'THE KEYBOARD GUY',
    role: 'CO-FOUNDER / KEYS / PRODUCER',
    tag: 'KEYS',
  },
  {
    name: 'DIGANTA',
    alias: 'ELECTRIC GUITARIST',
    role: 'CO-FOUNDER / GUITAR / PRODUCER',
    tag: 'GUITAR',
  },
  {
    name: 'ANARGHA',
    alias: 'THE SINGER',
    role: 'VOCALS',
    tag: 'VOICE',
  },
];

export default function BandIntro() {
  const { fretConfig } = useCapo();
  const isLightBg = fretConfig.bg === '#ffffff';
  const headingColor = isLightBg ? '#09090b' : '#ffffff';
  const borderColor = isLightBg ? 'rgba(9, 9, 11, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const gridLineColor = isLightBg ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)';
  const baseText = isLightBg ? 'rgba(9, 9, 11, ' : 'rgba(255, 255, 255, ';

  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });

  const bannerRef = useRef<HTMLElement>(null);
  // tried -10% here but not good for mobile view
  // -20% gives it enough room to breathe
  const bannerInView = useInView(bannerRef, { once: true, margin: '-20%' });

  const membersRef = useRef<HTMLElement>(null);
  const membersInView = useInView(membersRef, { once: true, margin: '-10%' });

  return (
    <>
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 pt-28 pb-16 overflow-hidden transition-colors duration-300"
        style={{ background: fretConfig.bg }}
      >
        {/*background grid lines*/}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <SectionLabel
          label="DIMENSION 4 // THE SOUND"
          isInView={heroInView}
          accent={fretConfig.accent}
          className="mb-6 justify-center"
        />

        <motion.h1
          className="font-mono font-black text-center leading-none tracking-tighter mb-4"
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            color: fretConfig.accent,
            textShadow: isLightBg ? 'none' : `0 0 80px ${fretConfig.accent}40`,
          }}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
        >
          GLUKONDD
        </motion.h1>

        <motion.div
          className="font-mono text-center tracking-[0.5em] uppercase mb-8"
          style={{
            fontSize: 'clamp(0.65rem, 2vw, 1rem)',
            color: `${baseText}0.5)`,
          }}
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          &amp; THE SIGNAL CHAIN
        </motion.div>

        <motion.p
          className="font-mono text-center max-w-2xl leading-relaxed"
          style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
            color: `${baseText}0.65)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45 }}
        >
          Every track is a document. Every session, a reckoning.
        </motion.p>

        <motion.div
          className="w-full max-w-3xl h-px mt-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${fretConfig.accent}60, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </section>

      <SpotifySection />

      <section
        ref={bannerRef}
        className="relative w-full h-[35vh] sm:h-[45vh] md:h-[75vh] overflow-hidden border-y transition-colors duration-300"
        style={{ borderColor: borderColor }}
      >
        <motion.img
          src="/images/band-intro.jpg"
          alt="band photo"
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] filter brightness-[0.8] contrast-125"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={bannerInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.03 }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95 pointer-events-none" />

        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-10 text-center px-4 select-none">
          <motion.h2
            className="font-mono font-black tracking-tighter uppercase leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 8.5rem)',

              color: isLightBg ? '#ffffff' : fretConfig.accent,
              textShadow: isLightBg
                ? '0 4px 24px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.4)'
                : `0 0 40px ${fretConfig.accent}60, 0 4px 20px rgba(0,0,0,0.8)`,
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={bannerInView ? { opacity: 1, y: 0, letterSpacing: '-0.02em' } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            THE DINOZAUR BAND
          </motion.h2>
          <motion.p
            className="text-zinc-400 tracking-[0.6em] text-[9px] md:text-xs mt-3 uppercase font-mono font-bold"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={bannerInView ? { opacity: 0.85 } : {}}
            transition={{ delay: 0.6 }}
          >
            HERE FOR THE PLOT
          </motion.p>
        </div>
      </section>

      <section
        ref={membersRef}
        className="px-6 md:px-12 lg:px-24 py-20 transition-colors duration-300"
        style={{ background: fretConfig.bg }}
      >
        <SectionLabel
          label="BAND MEMBERS //"
          isInView={membersInView}
          accent={fretConfig.accent}
          className="mb-10"
        />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px overflow-hidden border"
          style={{
            backgroundColor: borderColor,
            borderColor: borderColor,
          }}
        >
          {BAND_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              className="relative p-6 group cursor-default overflow-hidden transition-colors flex flex-col justify-between"
              style={{
                backgroundColor: fretConfig.bg || '#000000',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={membersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 150, damping: 20, delay: i * 0.1 }}
              whileHover={{ backgroundColor: `${fretConfig.accent}08` }}
            >
              <div>
                <div
                  className="font-mono text-[9px] tracking-[0.35em] uppercase mb-4 px-2 py-1 inline-block border font-bold"
                  style={{ color: fretConfig.accent, borderColor: `${fretConfig.accent}40` }}
                >
                  {member.tag}
                </div>

                <h3
                  className="font-mono font-black text-xl tracking-tight leading-none mb-1"
                  style={{ color: headingColor }}
                >
                  {member.name}
                </h3>

                <div
                  className="font-mono text-[10px] tracking-widest uppercase mb-3 font-semibold"
                  style={{ color: fretConfig.accent, opacity: 0.9 }}
                >
                  &quot;{member.alias}&quot;
                </div>

                <div
                  className="font-mono text-[11px] tracking-wider uppercase mb-4 font-bold"
                  style={{ color: `${baseText}0.75)` }}
                >
                  {member.role}
                </div>
              </div>

              {/*hover line*/}
              <motion.div
                className="absolute bottom-0 left-0 h-px w-full origin-left"
                style={{ background: fretConfig.accent }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />

              <div
                className="absolute top-4 right-4 font-mono text-[10px] font-bold"
                style={{ color: fretConfig.accent, opacity: 0.35 }}
              >
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
