'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { SideQuest } from '@/types';
import { useCapo } from '@/context/CapoContext';

export default function SideQuests({ initialQuests }: { initialQuests: SideQuest[] }) {
  const { fretConfig } = useCapo();
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sectionVisible = useInView(sectionRef, { once: true, amount: 0.2 });
  const quests = initialQuests || [];

  const fg = fretConfig.fg;

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-12 lg:px-24 py-16 pb-24"
      style={{ background: fretConfig.bg }}
    >
      <motion.button
        className="w-full text-left border py-5 px-6 group transition-all"
        style={{
          borderColor: `${fg}20`,
          background: open ? `${fretConfig.accent}10` : 'transparent',
        }}
        onClick={() => setOpen(!open)}
        initial={{ opacity: 0 }}
        animate={sectionVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        whileHover={{ borderColor: fretConfig.accent }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.span
              className="font-mono text-sm font-bold"
              style={{ color: fretConfig.accent }}
              animate={{ rotate: open ? 90 : 0 }}
            >
              &gt;
            </motion.span>
            <span
              className="font-mono text-sm font-bold tracking-[0.2em] uppercase"
              style={{ color: fg }}
            >
              EXECUTE: SIDE QUESTS
            </span>
          </div>
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: fretConfig.accent, opacity: 0.6 }}
          >
            {open ? '[COLLAPSE]' : '[EXPAND]'} {'//'} {quests.length} ACTIVE
          </span>
        </div>
      </motion.button>

      {/* <button onClick={() => setOpen(true)} className="text-xs text-accent">expand all</button> */}

      <AnimatePresence>
        {open && (
          <motion.div
            className="border border-t-0 overflow-hidden"
            style={{ borderColor: `${fg}20` }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            // 220/28 
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          >
            <div className="divide-y" style={{ borderColor: `${fg}10` }}>
              {quests.map((quest, i) => {
                const isLatest = i === 0;
                return (
                  <motion.div
                    key={quest.id || i}
                    className="px-6 py-5 space-y-3 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/*Green Blinking Signal*/}
                    {isLatest && (
                      <div
                        className="absolute left-2 top-8 w-1.5 h-1.5 rounded-full animate-blink-green"
                        style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }}
                      />
                    )}

                    <div className="flex flex-wrap items-center gap-4 pl-4">
                      {quest.date && (
                        <span
                          className="font-mono text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 border"
                          style={{
                            borderColor: `${fretConfig.accent}40`,
                            color: fretConfig.accent,
                          }}
                        >
                          {quest.date}
                        </span>
                      )}

                      {quest.tags && quest.tags.length > 0 && (
                        <span
                          className="font-mono text-[9px] tracking-[0.2em] uppercase"
                          style={{ color: fg, opacity: 0.4 }}
                        >
                          TAGS: {quest.tags.join(' / ')}
                        </span>
                      )}
                    </div>

                    <div
                      className="font-mono text-sm font-bold tracking-widest uppercase pl-4"
                      style={{ color: fg }}
                    >
                      {quest.title}
                    </div>

                    {/*Description Box*/}
                    <div className="pl-4 pt-1">
                      <p
                        className="font-mono text-[11px] leading-relaxed border-l-2 pl-3 py-1"
                        style={{ color: fg, opacity: 0.6, borderColor: `${fretConfig.accent}50` }}
                      >
                        {quest.description || 'NO DATA FOUND.'}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
