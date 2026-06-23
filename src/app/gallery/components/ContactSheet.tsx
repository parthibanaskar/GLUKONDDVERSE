'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import type { GalleryItem } from '@/types';
import { supabase } from '@/utils/supabase/client';

// 8 holes in the film is good no lesser or higher
function SprocketHoles({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`absolute top-0 bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} w-5 flex flex-col justify-around items-center py-2 z-10`}
      style={{ background: '#0a0a0a' }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2 rounded-sm"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      ))}
    </div>
  );
}

function FilmStripCell({
  item,
  index,
  liked,
  onSelect,
  onLike,
}: {
  item: GalleryItem;
  index: number;
  liked: boolean;
  onSelect: () => void;
  onLike: (e: React.MouseEvent) => void;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const visible = useInView(cellRef, { once: true, margin: '-8%' });

  return (
    <motion.div
      ref={cellRef}
      className="break-inside-avoid relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay: index * 0.05 }}
    >
      <div
        className="relative bg-[#000] p-[20px] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] cursor-pointer"
        onClick={onSelect}
      >
        <SprocketHoles side="left" />
        <SprocketHoles side="right" />
        <div className="font-mono text-[8px] tracking-widest text-center py-1 text-white/25">
          ◼ GLUKONDD&apos;S LENS ◼
        </div>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.title || 'Gallery Image'}
            fill
            priority={index < 4}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="font-mono text-[8px] tracking-widest text-center py-1 text-white/15">
          ▲ ID: {item.id.slice(0, 4)} ▲
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center font-mono text-[10px] uppercase tracking-widest">
        <span className="text-white/40 truncate">{item.title}</span>
        <motion.button
          whileTap={{ scale: 0.7, rotate: -20 }}
          onClick={onLike}
          className={`transition-colors duration-300 ${liked ? 'text-red-500' : 'text-yellow-500/80 hover:text-yellow-400'}`}
        >
          <motion.span
            key={item.like_count}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            ♥ {item.like_count}
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ContactSheet() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('gallery_likes') || '{}');
    setLikedItems(savedLikes);

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleLike = async (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();

    setFlashing(true);
    setTimeout(() => setFlashing(false), 300);

    const isCurrentlyLiked = likedItems[item.id];
    const change = isCurrentlyLiked ? -1 : 1;
    const newCount = Math.max(0, item.like_count + change);

    const newLikedState = { ...likedItems, [item.id]: !isCurrentlyLiked };
    setLikedItems(newLikedState);
    localStorage.setItem('gallery_likes', JSON.stringify(newLikedState));
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, like_count: newCount } : i)));

    await supabase.rpc('increment_like', {
      row_id: item.id,
      delta: change,
    });

    fetch('/api/log-like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemTitle: item.title,
        action: isCurrentlyLiked ? 'unliked' : 'liked',
      }),
    }).catch(() => {});
  };

  if (loading)
    return (
      <div className="text-white/20 p-24 text-center font-mono animate-pulse">
        LOADING ARCHIVE...
      </div>
    );

  if (error)
    return (
      <div className="text-white/30 p-24 text-center font-mono text-[11px] tracking-[0.3em] uppercase">
        SIGNAL LOST — GALLERY UNAVAILABLE
      </div>
    );

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-24">
      <AnimatePresence>
        {flashing && (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none"
            style={{ background: 'rgba(255,255,255,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, times: [0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <div className="text-white/20 py-24 text-center font-mono text-[11px] tracking-[0.3em] uppercase">
          ARCHIVE EMPTY
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {items.map((item, i) => (
            <FilmStripCell
              key={item.id}
              item={item}
              index={i}
              liked={!!likedItems[item.id]}
              onSelect={() => setSelectedItem(item)}
              onLike={(e) => handleLike(e, item)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="max-w-3xl w-full"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="relative w-full max-h-[70vh]">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.title || 'Gallery item'}
                  width={1200}
                  height={800}
                  className="object-contain w-full"
                  quality={100}
                />
              </div>
              <h2 className="text-2xl font-mono text-white mt-6">{selectedItem.title}</h2>
              <p className="text-white/50 font-mono mt-2">{selectedItem.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
