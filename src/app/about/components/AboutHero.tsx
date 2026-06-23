'use client';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import AppImage from '@/components/ui/AppImage';
import SectionLabel from '@/components/ui/SectionLabel';

export default function AboutHero() {
  const { fretConfig, activeFret } = useCapo();
  const [glitching, setGlitching] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  // 15% is good, no changes pls 😭
  const visible = useInView(heroRef, { once: true, margin: '-15%' });

  const fg = fretConfig.fg;
  const isCinema = activeFret === 2;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center"
      style={{ background: fretConfig.bg }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-12 lg:gap-16 items-center">
        {/*potrait effect*/}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div
            className="relative aspect-portrait w-full max-w-xs mx-auto lg:mx-0 overflow-hidden cursor-pointer transition-all duration-500"
            style={{
              // no border change
              border: activeFret === 3 ? '2px solid #000000' : `1px solid ${fretConfig.accent}30`,
              filter: 'none',
            }}
            onMouseEnter={() => setGlitching(true)}
            onMouseLeave={() => setGlitching(false)}
          >
            <AppImage
              src="/images/about-hero-1.jpg"
              alt="Parthiba"
              fill
              className="object-cover object-top transition-transform duration-700"
              quality={100}
              style={{ transform: glitching ? 'scale(1.02)' : 'scale(1)' }}
            />

            {glitching && (
              <>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(/images/about-hero-2.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    mixBlendMode: 'screen',
                    opacity: 0.5,
                    transform: 'translateX(-3px)',
                    filter: 'hue-rotate(180deg) saturate(200%)',
                    clipPath: 'inset(20% 0 60% 0)',
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(/images/about-hero-2.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    mixBlendMode: 'screen',
                    opacity: 0.4,
                    transform: 'translateX(3px)',
                    filter: 'hue-rotate(0deg) saturate(200%)',
                    clipPath: 'inset(55% 0 25% 0)',
                  }}
                />
              </>
            )}

            {activeFret !== 3 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${fretConfig.bg} 0%, transparent 60%)`,
                }}
              />
            )}

            <div
              className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.3em] uppercase"
              style={{
                color: fretConfig.accent,
                opacity: glitching ? 1 : 0.5,
                transition: 'opacity 0.3s',
              }}
            >
              {glitching ? '// SIGNAL DISTORTED' : '// HOVER TO DISTORT'}
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <SectionLabel
            label="DOSSIER |"
            isInView={visible}
            accent={fretConfig.accent}
            className="mb-4"
          />

          <motion.h1
            className="text-display font-bold leading-tight"
            style={{
              color: fg,
              fontFamily: isCinema ? 'var(--font-fraunces)' : 'var(--font-dm-sans)',
              fontStyle: isCinema ? 'italic' : 'normal',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
          >
            PARTHIBA
          </motion.h1>

          <motion.div
            className="space-y-5 text-base leading-relaxed"
            style={{ color: fg, opacity: 0.7, maxWidth: '520px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 0.7, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <p>
              From Kolkata, currently pursuing B.Tech at IIIT Agartala. But these coordinates are
              merely the frame; the identity is built at the collision point of three disciplines:
              Engineering, Cinema, and Music.
            </p>
            <p>
              A web developer who thinks in frames. A cinematographer who codes systems. A musician
              who treats sound as architecture. I don&apos;t just build interfaces - I direct
              digital experiences.
            </p>
            <p>
              This dossier is a live transmission of my work. This is a field report from someone
              who refuses to choose a single dimension.
            </p>
          </motion.div>

          {/*stats*/}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            {[
              { label: 'NAME', value: 'PARTHIBA' },
              { label: 'ALIAS', value: 'PROF. GLUKONDD' },
              { label: 'LOCATION', value: 'KOLKATA / AGARTALA' },
              { label: 'STATUS', value: 'BREATHING' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div
                  className="font-mono text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: fretConfig.accent, opacity: 0.5 }}
                >
                  {stat.label}
                </div>
                <div
                  className="font-mono text-[12px] font-bold tracking-widest"
                  style={{ color: fg }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
