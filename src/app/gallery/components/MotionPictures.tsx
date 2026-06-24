'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Film } from '@/types';
import { supabase } from '@/utils/supabase/client';

export default function MotionPictures() {
  const [films, setFilms] = useState<Film[]>([]);
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);
  const [playerKey, setPlayerKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      const { data } = await supabase.from('films').select('*').order('id', { ascending: true });

      if (data && data.length > 0) {
        setFilms(data);
        setActiveFilm(data[0]);
      }
      setLoading(false);
    };
    fetchFilms();
  }, []);

  const handleSelectFilm = (film: Film) => {
    if (activeFilm && film.id === activeFilm.id) return;
    setActiveFilm(film);
    // bumped the key to force iframe remount  otherwise YouTube glitches
    setPlayerKey((k) => k + 1);
  };

  if (loading)
    return (
      <div className="p-24 text-center font-mono text-white/20">INITIALIZING PROJECTION...</div>
    );
  if (!activeFilm) return null;

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-24">
      {/*header*/}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/30">
            PROJECTION ROOM ACTIVE
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
          DOLBY VISION // ANAMORPHIC
        </span>
      </div>

      {/*NOW SHOWING*/}
      <motion.div
        className="mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="inline-flex items-center gap-3">
          <div
            className="font-mono text-[9px] tracking-[0.5em] uppercase px-3 py-1"
            style={{ background: '#EAB308', color: '#000' }}
          >
            NOW SHOWING
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeFilm.id}
              className="font-mono text-[10px] tracking-widest uppercase text-white/50"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeFilm.title}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      {/*player*/}
      <motion.div
        className="relative w-full overflow-hidden mb-2"
        style={{
          aspectRatio: '16/9',
          background: '#000',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 25, delay: 0.1 }}
      >
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none h-[7%] bg-black" />
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none h-[7%] bg-black" />

        <AnimatePresence mode="wait">
          <motion.div
            key={playerKey}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <iframe
              src={`https://drive.google.com/file/d/${activeFilm.drive_id}/preview`}
              title={activeFilm.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Active film*/}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilm.id + '-meta'}
          className="flex items-start justify-between mb-12 pt-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-white mb-1">
              {activeFilm.title}
            </h2>
            <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
              {activeFilm.subtitle}
            </p>
            <p className="font-mono text-[10px] text-white/25 mt-2 max-w-lg leading-relaxed">
              {activeFilm.synopsis}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 ml-8">
            <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">
              {activeFilm.year}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
              {activeFilm.duration}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">
              {activeFilm.format}
            </span>
            <div className="flex gap-1 mt-1 flex-wrap justify-end">
              {activeFilm.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 border border-white/12 text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/*Film*/}
      <div>
        <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-6">
          PROGRAMME — SELECT TO SCREEN
        </p>
        <div className="space-y-0">
          {films.map((film, i) => {
            const isActive = film.id === activeFilm.id;
            return (
              <motion.button
                key={film.id}
                onClick={() => handleSelectFilm(film)}
                className="w-full text-left group relative focus-visible:outline-none focus-visible:bg-yellow-500/10"
                aria-label={`Select ${film.title}`}
                whileHover={{ x: 4 }}
              >
                <div
                  className="flex items-center justify-between py-4 px-4 transition-colors duration-200"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: isActive ? 'rgba(234,179,8,0.06)' : 'transparent',
                    borderLeft: isActive ? '2px solid #EAB308' : '2px solid transparent',
                  }}
                >
                  <span
                    className="font-mono text-[9px] tracking-widest mr-6 shrink-0"
                    style={{ color: isActive ? '#EAB308' : 'rgba(255,255,255,0.2)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <span
                      className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase"
                      style={{ color: isActive ? '#EAB308' : 'rgba(255,255,255,0.8)' }}
                    >
                      {film.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 ml-4">
                    {isActive ? (
                      <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-mono text-[8px] tracking-widest text-red-400 uppercase">
                          PLAYING
                        </span>
                      </motion.div>
                    ) : (
                      <span className="font-mono text-[8px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/30">
                        SCREEN ▶
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
