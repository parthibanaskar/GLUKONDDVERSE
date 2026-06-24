'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';
import type { SiteStats } from '@/types';

export default function EngineeringLedger({ initialStats }: { initialStats: SiteStats | null }) {
  const { fretConfig, activeFret } = useCapo();
  const accent = fretConfig.accent;
  const bg = fretConfig.bg;
  const isCinema = activeFret === 2;

  const ledgerRef = useRef<HTMLElement>(null);
  //  want this to fire as soon as any part of it hits viewport
  const ledgerInView = useInView(ledgerRef, { once: true });
  const stats = initialStats || null;

  return (
    <section
      ref={ledgerRef}
      className="relative min-h-[60vh] pt-28 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center"
      style={{ background: bg }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
        style={{ opacity: 0.025 }}
      >
        <span
          className="font-bold text-[20vw] leading-none tracking-tighter whitespace-nowrap text-ink"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          LEDGER
        </span>
      </div>

      <div className="relative z-10">
        <SectionLabel
          label="CAREER // ENGINEERING LEDGER"
          isInView={ledgerInView}
          accent={accent}
          className="mb-8"
        />

        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={ledgerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
        >
          <h1
            className="text-hero font-black leading-none text-ink"
            style={{
              fontFamily: isCinema ? 'var(--font-fraunces)' : 'var(--font-dm-sans)',
              fontStyle: isCinema ? 'italic' : 'normal',
              letterSpacing: '-0.03em',
            }}
          >
            ENGINEERING
            <br />
            <span style={{ color: accent }}>LEDGER.</span>
          </h1>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row md:items-end gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={ledgerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
        >
          <p className="text-base leading-relaxed max-w-lg text-ink/55">
            A record of systems built, problems dissolved, and interfaces that refuse to be ignored.
            Every project is a directorial act.
          </p>
          <motion.a
            href="/assets/parthiba-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 font-mono text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-4 border group"
            style={{
              background: accent,
              // white text there
              color: activeFret === 3 ? '#ffffff' : '#000000',
              borderColor: accent,
              whiteSpace: 'nowrap',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span>VIEW CV.PDF</span>
            <motion.span
              animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↗
            </motion.span>
          </motion.a>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 pt-10 border-t"
          style={{ borderColor: `${fretConfig.fg}15` }}
          initial={{ opacity: 0 }}
          animate={ledgerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: 'PROJECTS SHIPPED', value: stats?.projects_shipped || '01' },
            { label: 'DEPLOYMENTS', value: stats?.deployments || '01' },
            { label: 'SEMESTER', value: stats?.semester || '3/8' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div
                className="font-mono text-[9px] tracking-[0.3em] uppercase"
                style={{ color: accent, opacity: 0.5 }}
              >
                {stat.label}
              </div>
              <div className="font-mono text-2xl font-bold tracking-tight text-ink">
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
