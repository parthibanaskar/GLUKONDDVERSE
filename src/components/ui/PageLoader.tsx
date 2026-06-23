'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';

interface PageLoaderProps {
  lines: string[];
}

export default function PageLoader({ lines }: PageLoaderProps) {
  const { fretConfig } = useCapo();
  const [visible, setVisible] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lineTimers: ReturnType<typeof setTimeout>[] = [];
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + 4;
      });
    }, 40);

    lines.forEach((_, i) => {
      lineTimers.push(
        setTimeout(() => {
          setCurrentLine(i);
        }, i * 250)
      );
    });

    // 1200ms

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 1200);

    return () => {
      clearInterval(progressTimer);
      lineTimers.forEach(clearTimeout);
      clearTimeout(hideTimer);
    };
  }, [lines]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center px-8"
          style={{ background: '#000000' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/*Lines*/}
          <div
            className="space-y-3 mb-12 w-full max-w-md border-l-2 pl-6"
            style={{ borderColor: `${fretConfig.accent}40` }}
          >
            {lines.map((line, i) => (
              <motion.div
                key={line}
                className="font-mono text-xs md:text-[13px] tracking-widest uppercase"
                style={{
                  color: i <= currentLine ? fretConfig.accent : 'rgba(255,255,255,0.2)',
                  opacity: i <= currentLine ? 1 : 0.5,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= currentLine ? 1 : 0.5, x: 0 }}
                transition={{ delay: i * 0.25 }}
              >
                {line}
                {i === currentLine && (
                  <span className="inline-block w-2 h-4 ml-2 bg-white animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>

          {/*Progress bar*/}
          <div
            className="w-full max-w-md h-px relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{ background: fretConfig.accent }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div
            className="font-mono text-[10px] tracking-[0.3em] uppercase mt-3"
            style={{ color: fretConfig.accent, opacity: 0.5 }}
          >
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
