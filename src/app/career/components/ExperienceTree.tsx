'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { Experience } from '@/types';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';

export default function ExperienceTree({
  initialExperiences,
}: {
  initialExperiences: Experience[];
}) {
  const { fretConfig } = useCapo();
  const accent = fretConfig.accent;
  const bg = fretConfig.bg;

  const experiences = initialExperiences || [];
  // default first one open 
  const [expandedId, setExpandedId] = useState<string | null>(
    experiences.length > 0 ? experiences[0].id : null
  );
  const treeRef = useRef<HTMLElement>(null);
  const hasEntered = useInView(treeRef, { margin: '-10%' });

  return (
    <section
      ref={treeRef}
      className="relative px-6 md:px-12 lg:px-24 py-24"
      style={{ background: bg }}
    >
      <SectionLabel
        label={`EXPERIENCE TREE // ${experiences.length} NODES`}
        isInView={hasEntered}
        accent={accent}
      />

      <div className="space-y-3">
        {experiences.map((exp, i) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            index={i}
            isExpanded={expandedId === exp.id}
            toggleExpand={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ExperienceCard({
  exp,
  index,
  isExpanded,
  toggleExpand,
}: {
  exp: Experience;
  index: number;
  isExpanded: boolean;
  toggleExpand: () => void;
}) {
  const { fretConfig } = useCapo();
  const accent = fretConfig.accent;

  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: '-8%' });

  return (
    <motion.div
      ref={cardRef}
      className="border overflow-hidden"
      style={{ borderColor: `${fretConfig.fg}15` }}
      initial={{ opacity: 0, y: 30 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay: index * 0.1 }}
    >
      <button
        id={`exp-btn-${exp.id}`}
        className="w-full flex items-center justify-between px-6 py-5 text-left group focus-visible:outline-none focus-visible:ring-2"
        onClick={toggleExpand}
        style={{ background: isExpanded ? `${accent}08` : 'transparent' }}
        aria-expanded={isExpanded}
        aria-controls={`exp-content-${exp.id}`}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            <span className="font-mono text-sm font-bold tracking-[0.1em] uppercase text-ink">
              {exp.role}
            </span>
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase pl-5"
            style={{ color: accent, opacity: 0.7 }}
          >
            {exp.org}
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="font-mono text-[9px] tracking-widest hidden md:block text-ink/40">
            {exp.period}
          </span>
          <motion.span
            className="font-mono text-sm"
            style={{ color: accent }}
            animate={{ rotate: isExpanded ? 45 : 0 }}
          >
            +
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`exp-content-${exp.id}`}
            role="region"
            aria-labelledby={`exp-btn-${exp.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="px-6 pb-6 pt-2 space-y-5 border-t"
              style={{ borderColor: `${fretConfig.fg}15` }}
            >
              <p className="text-sm leading-relaxed max-w-2xl text-ink/60">{exp.description}</p>
              <div className="space-y-2">
                {(exp.achievements ?? []).map((a: string) => (
                  <div key={a} className="flex items-start gap-3">
                    <span style={{ color: accent }} className="font-mono text-xs mt-0.5">
                      ✓
                    </span>
                    <span className="font-mono text-[11px] tracking-widest text-ink/70">{a}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(exp.tech ?? []).map((t: string) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border"
                    style={{ borderColor: `${fretConfig.accent}40`, color: accent }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
