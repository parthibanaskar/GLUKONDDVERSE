'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo, FretNumber, FRET_CONFIGS } from '@/context/CapoContext';

const FRET_LABELS: Record<FretNumber, string> = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
};

export default function CapoEngine() {
  const { activeFret, setActiveFret } = useCapo();
  const [hoveredFret, setHoveredFret] = useState<FretNumber | null>(null);

  const activeCfg = FRET_CONFIGS[activeFret];
  const frets: FretNumber[] = [0, 1, 2, 3];

  // N{fret} label kept it anyway

  return (
    <div className="fixed bottom-8 left-6 md:left-8 z-[90] flex flex-col items-center gap-2">
      <motion.div
        className="text-mono text-[9px] tracking-widest uppercase mb-1 transition-colors duration-300 font-bold"
        style={{ color: activeCfg.accent }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
      >
        CAPO
      </motion.div>

      <div
        className="relative flex flex-col items-center gap-1 p-2 border backdrop-blur-md transition-all duration-500 ease-in-out rounded-sm"
        style={{
          borderColor: activeCfg.capoBorder,
          background: activeCfg.capoBgContainer,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-px transition-colors duration-500"
          style={{ background: activeCfg.capoBorder }}
        />

        {frets.map((fret) => {
          const cfg = FRET_CONFIGS[fret];
          const isActive = activeFret === fret;
          const isHovered = hoveredFret === fret;

          return (
            <motion.button
              key={fret}
              aria-label={`Switch to ${cfg.label} theme`}
              aria-pressed={isActive}
              onClick={() => setActiveFret(fret)}
              onMouseEnter={() => setHoveredFret(fret)}
              onMouseLeave={() => setHoveredFret(null)}
              className="relative z-10 w-12 h-12 md:w-8 md:h-8 flex items-center justify-center text-mono text-[12px] md:text-[11px] font-black transition-all rounded-xs select-none touch-manipulation"
              style={{
                background: isActive ? activeCfg.capoBgActive : 'transparent',
                color: isActive
                  ? activeCfg.capoTextActive
                  : isHovered
                    ? activeCfg.accent
                    : activeCfg.capoTextInactive,
                borderColor: isActive ? activeCfg.accent : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            >
              {FRET_LABELS[fret]}

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-mono text-[9px] tracking-widest uppercase whitespace-nowrap px-2 py-1 pointer-events-none z-50 rounded-xs shadow-xl backdrop-blur-sm"
                    style={{
                      background: activeCfg.capoBgContainer,
                      color: activeCfg.accent,
                      borderColor: activeCfg.capoBorder,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {cfg.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        className="text-mono text-[8px] tracking-[0.3em] font-bold uppercase mt-1 transition-colors duration-300"
        style={{ color: activeCfg.accent }}
        key={activeFret}
      >
        N {activeFret}
      </motion.div>
    </div>
  );
}
