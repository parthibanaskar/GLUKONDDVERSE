'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';
import type { Milestone } from '@/types';

export default function GitTimeline({ initialMilestones }: { initialMilestones: Milestone[] }) {
  const { fretConfig, activeFret } = useCapo();
  const containerRef = useRef<HTMLElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-8%' });
  const milestones = initialMilestones;

  const fg = fretConfig.fg;
  const typeColors = {
    commit: fretConfig.accent,
    branch: activeFret === 3 ? '#555555' : '#888888',
    merge: '#22c55e',
    current: fretConfig.accent,
    feature: '#EAB308',
    release: '#10B981',
  };

  return (
    <section
      ref={containerRef}
      className="relative px-6 md:px-12 lg:px-24 py-24"
      style={{ background: fretConfig.bg }}
    >
      <SectionLabel
        label="REFLECTION TREE // PARTHIBA"
        isInView={inView}
        accent={fretConfig.accent}
      />

      <div className="relative pl-8 border-l-2" style={{ borderColor: `${fg}15` }}>
        {milestones.map((milestone, i) => {
          const typeKey = milestone.type as keyof typeof typeColors;
          const badgeColor = typeColors[typeKey] || fretConfig.accent || '#ffffff';

          const isLatest = i === 0;

          return (
            <motion.div
              key={milestone.id}
              className="relative mb-12 last:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.45, ease: 'easeOut' }}
            >
              {/*borders*/}
              <div
                className={`absolute -left-[37px] w-4 h-4 border-2 flex items-center justify-center ${isLatest ? 'animate-blink-green' : ''}`}
                style={{
                  background: fretConfig.bg,

                  borderColor: isLatest ? '#22c55e' : badgeColor,
                }}
              >
                <div
                  className="w-1.5 h-1.5"
                  style={{
                    background: isLatest ? '#22c55e' : badgeColor,
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className="font-mono text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: badgeColor }}
                  >
                    {milestone.date}
                  </span>
                  <span
                    className="font-mono text-[9px] tracking-widest"
                    style={{ color: fg, opacity: 0.3 }}
                  >
                    [{milestone.hash}]
                  </span>
                  <span
                    className="font-mono text-[9px] tracking-widest"
                    style={{ color: fg, opacity: 0.4 }}
                  >
                    on {milestone.branch}
                  </span>
                </div>
                <h3
                  className="font-mono text-sm font-bold tracking-widest uppercase"
                  style={{ color: fg }}
                >
                  {milestone.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-2xl"
                  style={{ color: fg, opacity: 0.6 }}
                >
                  {milestone.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {milestone.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border"
                      style={{ borderColor: `${badgeColor}50`, color: badgeColor }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
