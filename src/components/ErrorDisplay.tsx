'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
  isGlobal?: boolean;
}

export default function ErrorDisplay({ error, reset, isGlobal }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      <motion.div
        className="border border-red-500/30 p-8 md:p-12 max-w-lg w-full bg-red-950/10 relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="mb-8 border-b border-red-500/20 pb-6">
          <motion.h2
            className="text-xl md:text-2xl font-black text-red-500 tracking-[0.2em] uppercase"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {isGlobal ? 'DIMENSION COLLAPSE' : 'RUNTIME HALT'}
          </motion.h2>
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-red-500/50 mt-2">
            trace // {error.digest || 'unknown'}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-sm md:text-base text-white/60 leading-relaxed">
            {isGlobal
              ? 'Something took down the whole layout. Definitely not ideal.'
              : 'This page hit an exception and stopped rendering.'}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-black/50 border border-white/10 overflow-x-auto">
              <p className="text-xs text-red-400 mb-2 font-bold">{error.message}</p>
              <pre className="text-[10px] text-white/40 whitespace-pre-wrap font-mono">
                {error.stack}
              </pre>
            </div>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="w-full border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-black text-red-500 px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
        >
          TRY AGAIN
        </button>
      </motion.div>
    </div>
  );
}
