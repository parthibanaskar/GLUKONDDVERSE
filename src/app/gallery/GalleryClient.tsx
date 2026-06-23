'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import CapoEngine from '@/components/CapoEngine';
import GuestbookDrawer from '@/components/GuestbookDrawer';
import PageLoader from '@/components/ui/PageLoader';
import ContactSheet from './components/ContactSheet';
import MotionPictures from './components/MotionPictures';

const LOADER_LINES = [
  '> INITIALIZING OPTICAL DRIVE...',
  '> LOADING NEGATIVE ARCHIVE...',
  '> CALIBRATING LENS MATRIX...',
  '> MOUNTING FILM REEL...',
  '> THE LENS READY. 100%',
];

function GalleryContent() {
  const { fretConfig } = useCapo();
  const [view, setView] = useState<'contact' | 'motion'>('contact');

  return (
    <main className="relative min-h-screen pt-20" style={{ background: fretConfig.bg }}>
      <section className="px-6 md:px-12 lg:px-24 pt-16 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 1.4 }}
        >
          <p
            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: `${fretConfig.accent}80` }}
          >
            DIMENSION 3 // THE LENS
          </p>
          <h1
            className="font-mono text-display font-black uppercase leading-none mb-2"
            style={{ color: fretConfig.accent }}
          >
            THE
            <br />
            <span style={{ color: fretConfig.accent }}>ARCHIVE</span>
          </h1>
          <p
            className="font-mono text-[11px] tracking-widest uppercase mt-4"
            style={{ color: `${fretConfig.accent}60` }}
          >
            STILLS &amp; MOTION — VISUAL LEDGER
          </p>
        </motion.div>
      </section>

      <motion.div
        className="px-6 md:px-12 lg:px-24 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 150, damping: 25 }}
      >
        <div
          className="inline-flex border p-1 relative"
          style={{ borderColor: `${fretConfig.accent}40` }}
        >
          <motion.div
            className="absolute top-1 bottom-1"
            style={{ width: 'calc(50% - 4px)', background: fretConfig.accent }}
            animate={{ x: view === 'contact' ? 0 : 'calc(100% + 8px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setView('contact')}
            className="relative z-10 font-mono text-[10px] tracking-[0.25em] uppercase px-6 py-2.5 transition-colors duration-200"
            style={{ color: view === 'contact' ? fretConfig.bg : fretConfig.accent }}
          >
            35MM CONTACT SHEET
          </button>
          <button
            onClick={() => setView('motion')}
            className="relative z-10 font-mono text-[10px] tracking-[0.25em] uppercase px-6 py-2.5 transition-colors duration-200"
            style={{ color: view === 'motion' ? fretConfig.bg : fretConfig.accent }}
          >
            MOTION PICTURES
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'contact' ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ContactSheet />
          </motion.div>
        ) : (
          <motion.div
            key="motion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionPictures />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function GalleryClient() {
  return (
    <>
      <CustomCursor />
      <Header />
      <CapoEngine />
      <GuestbookDrawer />
      <PageLoader lines={LOADER_LINES} />
      <GalleryContent />
      <Footer />
    </>
  );
}
