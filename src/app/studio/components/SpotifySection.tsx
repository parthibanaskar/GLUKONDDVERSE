'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';
import { supabase } from '@/utils/supabase/client';
import type { MusicRelease, YoutubeVideo } from '@/types';

const getYouTubeId = (url: string) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
};

export default function SpotifySection() {
  const spotifyRef = useRef<HTMLDivElement>(null);
  // spotify cards are heavy btw
  const spotifyInView = useInView(spotifyRef, { once: true, margin: '-80px' });
  const [activeVideo, setActiveVideo] = useState(0);

  const [spotifyLinks, setSpotifyLinks] = useState<MusicRelease[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchArchiveData = async () => {
      setIsLoading(true);
      try {
        const [spotifyRes, ytRes] = await Promise.all([
          supabase.from('music_releases').select('*').order('release_year', { ascending: false }),
          supabase.from('youtube_videos').select('*').order('created_at', { ascending: true }),
        ]);

        if (spotifyRes.error) throw spotifyRes.error;
        if (ytRes.error) throw ytRes.error;

        if (spotifyRes.data) setSpotifyLinks(spotifyRes.data);
        if (ytRes.data) setYoutubeVideos(ytRes.data);
      } catch (err: unknown) {
        console.error('Failed to sync archives from Supabase:', err instanceof Error ? err.message : String(err));
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  const { fretConfig } = useCapo();
  const isLightBg = fretConfig.bg === '#ffffff';
  const headingColor = isLightBg ? '#09090b' : '#ffffff';
  const borderColor = isLightBg ? 'rgba(9, 9, 11, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const baseText = isLightBg ? 'rgba(9, 9, 11, ' : 'rgba(255, 255, 255, ';
  const cardBg = isLightBg ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)';

  const activeEmbedId = useMemo(() => {
    if (!youtubeVideos || youtubeVideos.length === 0) return '';
    return getYouTubeId(youtubeVideos[activeVideo]?.youtube_url);
  }, [youtubeVideos, activeVideo]);

  return (
    <section
      ref={spotifyRef}
      className="px-6 md:px-12 lg:px-24 py-16 transition-colors duration-300"
      style={{
        background: fretConfig.bg,
        borderTop: `1px solid ${borderColor}`,
      }}
    >
      {/*Spotify Links*/}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={spotifyInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <SectionLabel
          label="STREAMING // SPOTIFY"
          isInView={spotifyInView}
          accent={fretConfig.accent}
          className="mb-2"
        />
        <h2
          className="font-mono font-black text-3xl md:text-4xl tracking-tight mb-8"
          style={{ color: headingColor }}
        >
          ON THE WIRE
        </h2>

        {isLoading ? (
          <div
            className="py-12 border border-dashed flex items-center justify-center font-mono text-xs opacity-50 tracking-widest uppercase animate-pulse"
            style={{ borderColor }}
          >
            SYNCING FREQUENCIES...
          </div>
        ) : fetchError ? (
          <div
            className="py-12 border border-dashed flex items-center justify-center font-mono text-xs opacity-40 tracking-widest uppercase"
            style={{ borderColor }}
          >
            SIGNAL LOST — ARCHIVE UNAVAILABLE
          </div>
        ) : spotifyLinks.length === 0 ? (
          <div
            className="py-12 border border-dashed flex items-center justify-center font-mono text-xs opacity-40 tracking-widest uppercase"
            style={{ borderColor }}
          >
            TRACKS COMING SOON
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {spotifyLinks.map((item, i) => (
              <motion.a
                key={item.id || `release-${i}`}
                href={item.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col justify-between p-5 group overflow-hidden"
                style={{
                  border: `1px solid ${borderColor}`,
                  background: cardBg,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={spotifyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{
                  borderColor: `${fretConfig.accent}60`,
                  background: `${fretConfig.accent}08`,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="font-mono text-[9px] tracking-[0.3em] uppercase px-2 py-1 border"
                    style={{ color: '#1DB954', borderColor: '#1DB95440' }}
                  >
                    SPOTIFY
                  </div>
                  <div
                    className="font-mono text-[9px] tracking-widest uppercase"
                    style={{ color: `${baseText}0.4)` }}
                  >
                    {item.type} · {item.release_year}
                  </div>
                </div>

                <div>
                  <h3
                    className="font-mono font-black text-lg tracking-tight mb-2"
                    style={{ color: headingColor }}
                  >
                    {item.title}
                  </h3>
                  <div
                    className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-2 font-bold"
                    style={{ color: fretConfig.accent }}
                  >
                    <span>LISTEN NOW</span>
                    <span>↗</span>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-px w-full origin-left"
                  style={{ background: '#1DB954' }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={spotifyInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <SectionLabel
          label="VISUAL // YOUTUBE"
          isInView={spotifyInView}
          accent={fretConfig.accent}
          className="mb-2"
        />
        <h2
          className="font-mono font-black text-3xl md:text-4xl tracking-tight mb-8"
          style={{ color: headingColor }}
        >
          NOW SHOWING
        </h2>

        {isLoading ? (
          <div
            className="py-20 border border-dashed flex items-center justify-center font-mono text-xs opacity-50 tracking-widest uppercase"
            style={{ borderColor }}
          >
            LOADING VISUAL TRANSMISSIONS...
          </div>
        ) : youtubeVideos.length === 0 ? (
          <div
            className="py-20 border border-dashed flex items-center justify-center font-mono text-xs opacity-40 tracking-widest uppercase"
            style={{ borderColor }}
          >
            VISUAL FEED COMING SOON
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main player */}
            <div className="lg:col-span-2">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  border: `1px solid ${fretConfig.accent}40`,
                  aspectRatio: '16/9',
                  background: isLightBg ? '#000000' : 'transparent',
                }}
              >
                {activeEmbedId ? (
                  <iframe
                    key={activeVideo}
                    src={`https://www.youtube.com/embed/${activeEmbedId}?rel=0&modestbranding=1`}
                    title={youtubeVideos[activeVideo]?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-xs opacity-40">
                    INVALID YOUTUBE LINK FORMAT
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="font-mono font-bold text-sm tracking-wider uppercase"
                    style={{ color: headingColor }}
                  >
                    {youtubeVideos[activeVideo]?.title}
                  </h3>
                  <p className="font-mono text-[11px] mt-1" style={{ color: `${baseText}0.5)` }}>
                    {youtubeVideos[activeVideo]?.description}
                  </p>
                </div>
                <div
                  className="font-mono text-[9px] tracking-widest uppercase whitespace-nowrap"
                  style={{ color: fretConfig.accent, opacity: 0.8 }}
                >
                  {activeVideo + 1}/{youtubeVideos.length}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div
                className="font-mono text-[9px] tracking-[0.3em] uppercase mb-2"
                style={{ color: `${baseText}0.4)` }}
              >
                PLAYLIST
              </div>
              {youtubeVideos.map((video, i) => (
                <motion.button
                  key={video.id || `video-${i}`}
                  onClick={() => setActiveVideo(i)}
                  className="text-left p-4 relative overflow-hidden transition-colors"
                  style={{
                    border: `1px solid ${i === activeVideo ? fretConfig.accent + '70' : borderColor}`,
                    background: i === activeVideo ? `${fretConfig.accent}12` : cardBg,
                  }}
                  whileHover={{ borderColor: `${fretConfig.accent}60` }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[9px] font-bold"
                      style={{ color: fretConfig.accent }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div
                        className="font-mono text-[11px] font-bold tracking-wider uppercase leading-tight"
                        style={{
                          color:
                            i === activeVideo
                              ? isLightBg
                                ? '#000000'
                                : fretConfig.accent
                              : `${baseText}0.85)`,
                        }}
                      >
                        {video.title}
                      </div>
                      <div
                        className="font-mono text-[9px] mt-1 tracking-wider"
                        style={{ color: `${baseText}0.45)` }}
                      >
                        {video.description ? `${video.description.substring(0, 40)}...` : ''}
                      </div>
                    </div>
                  </div>
                  {i === activeVideo && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[2px]"
                      style={{ background: fretConfig.accent }}
                      layoutId="activeVideoIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
