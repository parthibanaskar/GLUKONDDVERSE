'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';

export default function FretWrapper({ children }: { children: React.ReactNode }) {
  const { activeFret, fretConfig } = useCapo();

  const layoutStyles = {
    0: 'font-mono tracking-tighter border-collapse',
    1: 'font-serif italic tracking-wide',
    2: 'font-serif uppercase tracking-widest',
    3: 'font-sans font-black tracking-tight',
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', fretConfig.bg);
    root.style.setProperty('--text', fretConfig.invertColors ? '#000000' : '#ffffff');
    root.style.setProperty('--accent', fretConfig.accent);

    document.body.style.backgroundColor = fretConfig.bg;
  }, [activeFret, fretConfig]);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 ${layoutStyles[activeFret as keyof typeof layoutStyles] || ''}`}
      style={{
        backgroundColor: fretConfig.bg,
        color: fretConfig.invertColors ? '#000000' : '#ffffff',
      }}
    >
      <AnimatePresence>
        <motion.div
          key={`fret-bg-${activeFret}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="absolute inset-0 pointer-events-none z-[-1]"
          style={{ backgroundColor: fretConfig.bg }}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {/* Fret 0*/}
        {activeFret === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[9995]"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(234, 179, 8, 0.05) 2px, rgba(234, 179, 8, 0.05) 4px)',
            }}
          />
        )}

        {/* Fret 3*/}
        {activeFret === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[9995]"
          >
            <div className="absolute top-4 left-0 right-0 h-4 bg-black/10" />
            <div className="absolute bottom-4 left-0 right-0 h-4 bg-black/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Noise Overlay*/}
      {fretConfig.noiseOverlay && (
        <div
          className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      <div id="main-content" className="relative z-10 w-full">{children}</div>
    </div>
  );
}
