'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { supabase } from '@/utils/supabase/client';
import { useCapo } from '@/context/CapoContext';

import type { Track } from '@/types';

const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/glukondd';

function TrackRow({ track, index, inView }: { track: Track; index: number; inView: boolean }) {
  const { fretConfig } = useCapo();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: expanded ? `${fretConfig.accent}08` : 'transparent',
        }}
        onClick={() => setExpanded(!expanded)}
        whileHover={{ background: `${fretConfig.accent}06` }}
      >
        {/* Main row */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-4">
          <span
            className="font-mono text-[10px] w-6 shrink-0 opacity-30"
            style={{ color: fretConfig.accent }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="font-mono font-black text-sm md:text-base tracking-wider uppercase"
                style={{ color: '#ffffff' }}
              >
                {track.title}
              </span>
              <div className="flex gap-1 flex-wrap">
                {(track.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 border"
                    style={{ color: fretConfig.accent, borderColor: `${fretConfig.accent}30` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="font-mono text-[10px] tracking-wider mt-0.5"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {track.genre} · {track.year}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 shrink-0">
            <div className="text-center">
              <div
                className="font-mono text-[9px] tracking-widest uppercase opacity-30"
                style={{ color: '#ffffff' }}
              >
                BPM
              </div>
              <div className="font-mono text-[11px] font-bold" style={{ color: fretConfig.accent }}>
                {track.bpm}
              </div>
            </div>
            <div className="text-center">
              <div
                className="font-mono text-[9px] tracking-widest uppercase opacity-30"
                style={{ color: '#ffffff' }}
              >
                KEY
              </div>
              <div className="font-mono text-[11px] font-bold" style={{ color: fretConfig.accent }}>
                {track.key_signature}
              </div>
            </div>
            <div className="text-center">
              <div
                className="font-mono text-[9px] tracking-widest uppercase opacity-30"
                style={{ color: '#ffffff' }}
              >
                DUR
              </div>
              <div className="font-mono text-[11px] font-bold" style={{ color: '#ffffff' }}>
                {track.duration}
              </div>
            </div>
          </div>

          <motion.a
            href={track.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-[9px] tracking-widest uppercase px-3 py-2 border flex items-center gap-1.5"
            style={{ color: '#1DB954', borderColor: '#1DB95440' }}
            onClick={(e) => e.stopPropagation()}
            whileHover={{ background: '#1DB95420', borderColor: '#1DB954' }}
          >
            <span>▶</span>
            <span className="hidden sm:inline">SPOTIFY</span>
          </motion.a>

          <motion.span
            className="font-mono text-[10px] ml-1 shrink-0"
            style={{ color: fretConfig.accent, opacity: 0.5 }}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </div>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ overflow: 'hidden' }}
        >
          <div
            className="px-4 md:px-6 pb-4 pt-0 border-t"
            style={{ borderColor: `${fretConfig.accent}20` }}
          >
            <p
              className="font-mono text-[12px] leading-relaxed mt-3"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {track.description}
            </p>
            <div className="flex items-center gap-4 mt-3 md:hidden">
              <span className="font-mono text-[10px]" style={{ color: fretConfig.accent }}>
                {track.bpm} BPM · {track.key_signature} · {track.duration}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function TrackShowcase() {
  const { fretConfig } = useCapo();
  const trackRef = useRef<HTMLDivElement>(null);
  // -80px so the section header enters before tracks animate in
  const tracksVisible = useInView(trackRef, { once: true, margin: '-80px' });

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchArchive() {
      try {
        const { data, error } = await supabase
          .from('archive_tracks')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && isMounted) {
          setTracks(data as Track[]);
        }
      } catch (err) {
        console.error('Error fetching archive tracks:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchArchive();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="px-6 md:px-12 lg:px-24 py-16"
      style={{
        background: fretConfig.bg,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={tracksVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div>
          <SectionLabel
            label="DISCOGRAPHY // ALL TRACKS"
            isInView={tracksVisible}
            accent={fretConfig.accent}
            className="mb-2"
          />
          <h2
            className="font-mono font-black text-3xl md:text-4xl tracking-tight"
            style={{ color: '#ffffff' }}
          >
            THE ARCHIVE
          </h2>
        </div>
        {SPOTIFY_ARTIST_URL ? (
          <motion.a
            href={SPOTIFY_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest uppercase px-4 py-3 border flex items-center gap-2 self-start md:self-auto"
            style={{ color: '#1DB954', borderColor: '#1DB95440' }}
            whileHover={{ background: '#1DB95415', borderColor: '#1DB954' }}
          >
            <span>◈</span>
            <span>FOLLOW ON SPOTIFY</span>
            <span>↗</span>
          </motion.a>
        ) : null}
      </motion.div>

      {/* Column headers */}
      <motion.div
        className="hidden md:flex items-center gap-4 px-4 md:px-6 pb-3 mb-1"
        style={{ borderBottom: `1px solid ${fretConfig.accent}20` }}
        initial={{ opacity: 0 }}
        animate={tracksVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase w-6 shrink-0"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          #
        </span>
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase flex-1"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          TITLE
        </span>
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase w-24 text-center"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          STATS
        </span>
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase w-20 text-center"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          STREAM
        </span>
      </motion.div>

      <div className="min-h-[200px]">
        {loading ? (
          <div
            className="py-16 text-center font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 animate-pulse"
            style={{ color: '#ffffff' }}
          >
            loading...
          </div>
        ) : error ? (
          <div
            className="py-16 text-center font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: fretConfig.accent, opacity: 0.5 }}
          >
            couldn&apos;t load tracks — check back later
          </div>
        ) : tracks.length === 0 ? (
          <div
            className="py-16 text-center font-mono text-[10px] tracking-[0.3em] uppercase opacity-30"
            style={{ color: '#ffffff' }}
          >
            nothing here yet
          </div>
        ) : (
          tracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} inView={tracksVisible} />
          ))
        )}
      </div>

      {/* Footer*/}
      <motion.div
        className="mt-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={tracksVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span
          className="font-mono text-[9px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          {loading ? '---' : tracks.length} TRACKS // GLUKONDD & THE SIGNAL CHAIN
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </motion.div>
    </section>
  );
}
