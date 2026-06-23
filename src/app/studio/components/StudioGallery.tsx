'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/utils/supabase/client';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';
import type { GalleryFrequencyItem } from '@/types';

export default function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // -60px
  const galleryInView = useInView(containerRef, { once: true, margin: '-60px' });

  const [galleryItems, setGalleryItems] = useState<GalleryFrequencyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('gallery_frequency')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setGalleryItems(data);
      } catch (err) {
        console.error('Failed to sync gallery archive from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const { fretConfig } = useCapo();
  const isLightBg = fretConfig.bg === '#ffffff';
  const headingColor = isLightBg ? '#09090b' : '#ffffff';
  const borderColor = isLightBg ? 'rgba(9, 9, 11, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const gridLineColor = isLightBg ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)';

  function getAspectClass(index: number) {
    const patternIndex = index % 5;
    switch (patternIndex) {
      case 0:
        return 'aspect-[4/5]';
      case 1:
        return 'aspect-video md:col-span-2';
      case 2:
        return 'aspect-square';
      case 3:
        return 'aspect-[3/4]';
      case 4:
        return 'aspect-video md:col-span-2 lg:col-span-1';
      default:
        return 'aspect-square';
    }
  }

  return (
    <section
      ref={containerRef}
      className="px-6 md:px-12 lg:px-24 py-20 transition-colors duration-300 relative overflow-hidden border-t"
      style={{
        background: fretConfig.bg,
        borderColor: borderColor,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        className="mb-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={galleryInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <SectionLabel
          label="ARCHIVE // VISUAL LOGS"
          isInView={galleryInView}
          accent={fretConfig.accent}
          className="mb-2"
        />
        <h2
          className="font-mono font-black text-3xl md:text-4xl tracking-tight uppercase"
          style={{ color: headingColor }}
        >
          THE GALLERY FREQUENCY
        </h2>
      </motion.div>

      {isLoading ? (
        <div
          className="w-full py-24 border border-dashed flex items-center justify-center font-mono text-xs opacity-50 tracking-widest uppercase relative z-10"
          style={{ borderColor }}
        >
          ESTABLISHING VISUAL CONNECTION...
        </div>
      ) : galleryItems.length === 0 ? (
        <div
          className="w-full py-24 border border-dashed flex items-center justify-center font-mono text-xs opacity-40 tracking-widest uppercase relative z-10"
          style={{ borderColor }}
        >
          NO VISUAL LOGS DETECTED ON SERVER
        </div>
      ) : (
        /*Composite Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {galleryItems.map((item, i) => {
            const layoutClass = getAspectClass(i);
            const rawId = item.feed_number.replace(/\D/g, '') || String(i + 1).padStart(2, '0');

            return (
              <motion.div
                key={item.id || `gallery-${i}`}
                className={`flex flex-col justify-between group cursor-crosshair border p-3 ${layoutClass}`}
                style={{
                  borderColor: borderColor,
                  backgroundColor: isLightBg ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  duration: 0.6,
                }}
              >
                {/*descriptor bar */}
                <div className="flex items-center justify-between font-mono text-[9px] mb-3 opacity-60">
                  <span style={{ color: fretConfig.accent }} className="font-bold">
                    {item.tag_category} {'//'} {item.tag_location}
                  </span>
                  <span style={{ color: headingColor }}>{item.log_date}</span>
                </div>

                {/* Main Image */}
                <div className="relative w-full flex-grow overflow-hidden bg-zinc-900/10 border border-transparent group-hover:border-zinc-500/20 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] opacity-20 pointer-events-none select-none text-zinc-500 text-center px-4">
                    [ CAMERA FEED LOG {rawId} ]
                  </div>

                  <Image
                    src={item.image_url}
                    alt={item.title || 'Gallery item'}
                    fill
                    className="object-contain filter grayscale contrast-125 brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  <div
                    className="absolute bottom-2 right-2 font-mono text-[8px] tracking-widest opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none uppercase"
                    style={{ color: headingColor }}
                  >
                    SYS REC 0{rawId}
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="mt-3 pt-2 flex items-baseline justify-between border-t border-dashed"
                  style={{ borderColor: borderColor }}
                >
                  <h3
                    className="font-mono font-black text-sm tracking-tight uppercase"
                    style={{ color: headingColor }}
                  >
                    {item.title}
                  </h3>
                  <span
                    className="font-mono text-[9px] font-bold"
                    style={{ color: fretConfig.accent }}
                  >
                    {item.feed_number}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
