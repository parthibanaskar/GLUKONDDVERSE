'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import type { MerchItem } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLoader from '@/components/ui/PageLoader';
import CustomCursor from '@/components/CustomCursor';
import CapoEngine from '@/components/CapoEngine';
import GuestbookDrawer from '@/components/GuestbookDrawer';
import AppImage from '@/components/ui/AppImage';

const LOADER_LINES = [
  '> DISABLING PRODUCTIVITY PROTOCOLS...',
  '> UNLOADING HUSTLE CULTURE.EXE...',
  '> CALIBRATING ZERO EFFORT MODE...',
  '> INITIALIZING THE SANCTUARY...',
  '> WELCOME TO GIVING UP. 100%',
];

const SARCASTIC_TEXTS: Record<number, string> = {
  100: 'Peak delusion. You still think effort matters.',
  90: "Impressive. You're 10% closer to enlightenment.",
  80: 'Still grinding? Adorable.',
  70: 'Your productivity guru is crying right now.',
  60: 'The hustle is leaving your body. Let it.',
  50: 'Halfway to wisdom. The other half is napping.',
  40: 'Your LinkedIn connections are confused.',
  30: 'You can almost hear the silence. Beautiful.',
  20: 'Almost there. The void is warm and welcoming.',
  10: 'One final push. Ironically.',
  0: 'ENLIGHTENMENT ACHIEVED. You are ready.',
};

function EffortSlider() {
  const [value, setValue] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const snappedValue = Math.round(value / 10) * 10;
  const displayedText = SARCASTIC_TEXTS[snappedValue] ?? '';

  const getValueFromEvent = useCallback((clientX: number) => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * 100);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setValue(getValueFromEvent(e.clientX));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setValue(getValueFromEvent(e.touches[0].clientX));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setValue(getValueFromEvent(e.clientX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      setValue(getValueFromEvent(e.touches[0].clientX));
    };

    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, getValueFromEvent]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-40">
          EFFORT LEVEL
        </span>
        <motion.span
          key={value}
          className="font-mono text-4xl font-black leading-none"
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {value}
        </motion.span>
      </div>

      <div
        ref={sliderRef}
        className="relative w-full h-12 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setValue((prev) => Math.max(0, prev - 1));
          if (e.key === 'ArrowRight') setValue((prev) => Math.min(100, prev + 1));
        }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--ink)] opacity-20" />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-[var(--ink)] origin-left"
          style={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {Array.from({ length: 11 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-[var(--ink)] opacity-30"
            style={{ left: `${i * 10}%` }}
          />
        ))}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--ink)] border-2 border-[var(--ink)] flex items-center justify-center"
          style={{ left: `calc(${value}% - 16px)` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="w-1 h-4 bg-[var(--bg)] opacity-60" />
        </motion.div>
      </div>

      <div className="flex justify-between mt-3 opacity-40">
        <span className="font-mono text-[9px] tracking-widest uppercase">ZERO EFFORT</span>
        <span className="font-mono text-[9px] tracking-widest uppercase">PEAK DELUSION</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={snappedValue}
          className="mt-8 border-l-4 border-[var(--ink)] pl-6 py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <p className="font-mono text-sm tracking-wide opacity-70 italic">
            &quot;{displayedText}&quot;
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {value === 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-50 mb-4">
              YOU HAVE EARNED THIS
            </p>
            <motion.a
              href="https://forms.gle/geUtaH1BauKNEvG48"
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 py-5 bg-[var(--ink)] text-[var(--bg)] font-mono text-sm font-bold tracking-[0.3em] uppercase border-2 border-[var(--ink)] cursor-pointer inline-block"
              whileHover={{ scale: 1.02, background: 'transparent', color: 'var(--ink)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              JOIN THE SANCTUARY ↗
            </motion.a>
            <p className="font-mono text-[9px] tracking-widest opacity-40 uppercase mt-4">
              MEMBERSHIP IS FREE. EFFORT IS NOT REQUIRED.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MerchCard({ item }: { item: MerchItem }) {
  const safeSizes = Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes : ['ONE SIZE'];
  const safeName = item.name || 'UNKNOWN ITEM';
  const safeDesc = item.description || 'No description provided.';
  const safeSubtitle = item.material_and_color || 'UNKNOWN ORIGIN';

  const primaryImage =
    Array.isArray(item.image_url) && item.image_url.length > 0
      ? item.image_url[0]
      : typeof item.image_url === 'string'
        ? item.image_url
        : null;

  const formattedPrice = item.price_inr
    ? `₹${Number(item.price_inr).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : 'TBA';

  const guessColor = safeName.toUpperCase().includes('HOODIE') ? '#111111' : '#F5F5F0';
  const safeColor = item.color || guessColor;

  const [selectedSize, setSelectedSize] = useState(safeSizes[0]);
  const [added, setAdded] = useState(false);

  const handleSecure = () => {
    setAdded(true);

    if (item.redirect_url) {
      window.open(item.redirect_url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn(`No url found in database for item: ${safeName}`);
    }

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-transparent group h-full flex flex-col justify-between">
      <div>
        <div
          className="w-full aspect-square flex items-center justify-center relative overflow-hidden border-b-2 border-[var(--ink)] transition-colors duration-500"
          style={{ background: safeColor }}
        >
          {primaryImage ? (
            <AppImage src={primaryImage} alt={safeName} fill className="object-cover" />
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {safeName.toUpperCase().includes('HOODIE') ? (
                <svg viewBox="0 0 200 220" className="w-40 h-40 opacity-80" fill="none">
                  <path
                    d="M60 40 L20 80 L40 90 L40 180 L160 180 L160 90 L180 80 L140 40 Q120 20 100 20 Q80 20 60 40Z"
                    fill={
                      safeColor === '#000000' || safeColor === '#111111'
                        ? '#1a1a1a'
                        : safeColor === '#F5F5F0'
                          ? '#e0e0d8'
                          : '#3a3a3a'
                    }
                    stroke={safeColor === '#F5F5F0' ? '#000' : '#fff'}
                    strokeWidth="3"
                  />
                  <path
                    d="M75 40 Q100 55 125 40"
                    stroke={safeColor === '#F5F5F0' ? '#000' : '#fff'}
                    strokeWidth="2"
                    fill="none"
                  />
                  <text
                    x="100"
                    y="120"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="10"
                    fill={safeColor === '#F5F5F0' ? '#000' : '#fff'}
                    opacity="0.7"
                  >
                    GIVE UP
                  </text>
                </svg>
              ) : (
                <svg viewBox="0 0 200 160" className="w-40 h-32 opacity-80" fill="none">
                  <path
                    d="M30 100 Q30 60 100 50 Q170 60 170 100 L160 110 L40 110 Z"
                    fill={safeColor === '#F5F5F0' ? '#e0e0d8' : '#2a2a2a'}
                    stroke={safeColor === '#F5F5F0' ? '#000' : '#fff'}
                    strokeWidth="3"
                  />
                  <rect
                    x="40"
                    y="108"
                    width="120"
                    height="12"
                    fill={safeColor === '#F5F5F0' ? '#ccc' : '#111'}
                    stroke={safeColor === '#F5F5F0' ? '#000' : '#fff'}
                    strokeWidth="2"
                  />
                  <text
                    x="100"
                    y="88"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="9"
                    fill={safeColor === '#F5F5F0' ? '#000' : '#fff'}
                    opacity="0.7"
                  >
                    STOP TRYING
                  </text>
                </svg>
              )}
            </div>
          )}

          {item.status_badge && (
            <div className="absolute top-4 left-4 bg-[var(--ink)] text-[var(--bg)] font-mono text-[9px] tracking-widest px-2 py-1 uppercase z-10">
              {item.status_badge}
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-50 mb-1">
            {safeSubtitle}
          </p>
          <h3 className="font-mono text-xl font-black uppercase tracking-tight mb-3">{safeName}</h3>
          <p className="font-mono text-[11px] opacity-70 leading-relaxed mb-5">{safeDesc}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {safeSizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className="font-mono text-[10px] tracking-widest px-3 py-1.5 border border-[var(--ink)] uppercase transition-all duration-150"
                style={{
                  background: selectedSize === size ? 'var(--ink)' : 'transparent',
                  color: selectedSize === size ? 'var(--bg)' : 'var(--ink)',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="flex items-center justify-between border-t-2 border-[var(--ink)] pt-4">
          <span className="font-mono text-2xl font-black tracking-tight">{formattedPrice}</span>
          <motion.button
            onClick={handleSecure}
            className="px-6 py-3 font-mono text-[10px] font-bold tracking-[0.25em] uppercase border-2 border-[var(--ink)] transition-all duration-150 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
            style={{
              background: added ? 'var(--ink)' : 'transparent',
              color: added ? 'var(--bg)' : 'var(--ink)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {added ? 'REDIRECTING ↗' : 'SECURE YOURS'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function ClubClient({ initialMerch }: { initialMerch: MerchItem[] }) {
  const { fretConfig } = useCapo();
  const themeInk = fretConfig.accent || '#000000';
  const displayMerch = initialMerch || [];

  return (
    <div
      className="min-h-screen w-full bg-transparent text-[var(--ink)] transition-colors duration-500"
      style={{ '--ink': themeInk } as React.CSSProperties}
    >
      <CustomCursor />
      <Header />
      <CapoEngine />
      <GuestbookDrawer />
      <PageLoader lines={LOADER_LINES} />

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 pt-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-24 left-0 w-24 h-1 bg-[var(--ink)]" />
            <div className="absolute top-24 right-0 w-24 h-1 bg-[var(--ink)]" />
            <div className="absolute bottom-24 left-0 w-24 h-1 bg-[var(--ink)]" />
            <div className="absolute bottom-24 right-0 w-24 h-1 bg-[var(--ink)]" />
            <div className="absolute top-0 left-24 w-1 h-24 bg-[var(--ink)]" />
            <div className="absolute top-0 right-24 w-1 h-24 bg-[var(--ink)]" />
          </div>

          <motion.div
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <motion.p
              className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-50 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              DIMENSION 5 // THE SANCTUARY
            </motion.p>

            <motion.h1
              className="font-mono font-black uppercase leading-none mb-6"
              style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 110, damping: 22 }}
            >
              STOP
              <br />
              <span className="relative inline-block">
                TRYING.
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-1 bg-[var(--ink)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </motion.h1>

            <motion.h2
              className="font-mono font-black uppercase leading-none opacity-30 mb-16"
              style={{ fontSize: 'clamp(2rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 110, damping: 22 }}
            >
              START GIVING UP.
            </motion.h2>

            <motion.div
              className="max-w-2xl mx-auto space-y-6 text-left border-l-4 border-[var(--ink)] pl-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            >
              <p className="font-mono text-sm leading-relaxed opacity-80">
                The world will endlessly try to sell you a thousand frameworks for being normal-more
                conventional, more palatable, more relentlessly and exhaustingly safe. We have no
                interest in safe.
              </p>
              <p className="font-mono text-sm leading-relaxed opacity-80">
                The Sanctuary is a haven built strictly for the untamed creative mind, rooted in a
                radical philosophy: stop trying, and start giving up. This is not a surrender to
                defeat, but a deliberate surrender of the mundane. It is the conscious choice to
                give up on expectations, to abandon the standard blueprints of success, and to
                reject the heavy illusion that there is a &quot;right&quot; way to exist.
              </p>
              <p className="font-mono text-sm leading-relaxed opacity-80">
                Give up the rules. Give up the fear. We are here to create independently, wildly,
                and entirely without apology. Because when you finally strip away the anxiety of
                what others might think, what remains in the quiet aftermath is the only thing that
                was ever real-your pure, uncompromised vision.
              </p>
              <p className="font-mono text-[11px] tracking-widest uppercase opacity-50">
                — THE SANCTUARY DOCTRINE, REVISION 0.0
              </p>
            </motion.div>
          </motion.div>
        </section>

        <section className="px-6 md:px-12 lg:px-24 py-32 border-t-2 border-[var(--ink)]">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-50 mb-3">
              INTERACTIVE PROTOCOL
            </p>
            <h2
              className="font-mono font-black uppercase leading-none mb-16"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              THE EFFORT
              <br />
              CALIBRATION
            </h2>
            <p className="font-mono text-sm opacity-60 mb-12 max-w-lg">
              Drag the slider from 100 to 0. Each step down is a step toward clarity. The join
              button appears only when you have fully committed to the doctrine.
            </p>

            <motion.div
              className="w-full flex flex-col items-center gap-2 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase opacity-40">
                DRAG TO ENLIGHTEN
              </span>
              <motion.div
                className="w-px h-12 bg-[var(--ink)] opacity-30"
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>

            <EffortSlider />
          </motion.div>
        </section>

        <section className="px-6 md:px-12 lg:px-24 py-32 border-t-2 border-[var(--ink)]">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-50 mb-3">
              MATERIAL DOCTRINE
            </p>

            <AnimatePresence mode="wait">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-mono font-black uppercase leading-none mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
              >
                THE ARCHIVES
              </motion.h2>
            </AnimatePresence>

            <p className="font-mono text-sm opacity-60 max-w-lg">
              Heavyweight garments for those who have nothing left to prove. Wear the philosophy. Or
              dont. We genuinely don&apos;t care.
            </p>
          </motion.div>

          {displayMerch.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-l-2 border-[var(--ink)]"
            >
              <AnimatePresence>
                {displayMerch.map((item, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                      type: 'spring',
                      stiffness: 200,
                      damping: 25,
                    }}
                    key={item.id || `merch-${i}`}
                    className="border-r-2 border-b-2 border-[var(--ink)]"
                  >
                    <MerchCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex justify-center items-center py-32 border-t-2 border-[var(--ink)] opacity-50">
              <p className="font-mono text-sm tracking-widest uppercase">
                THE ARCHIVES ARE CURRENTLY EMPTY.
              </p>
            </div>
          )}

          {displayMerch.length > 0 && (
            <motion.div
              layout
              className="mt-0 border-2 border-t-0 border-[var(--ink)] p-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-50 mb-4">
                THAT&apos;S IT. END OF COLLECTION.
              </p>
              <motion.button
                disabled
                className="w-full max-w-xl py-6 bg-transparent text-[var(--ink)] font-mono text-sm font-bold tracking-[0.3em] uppercase border-2 border-[var(--ink)] opacity-50 cursor-not-allowed"
              >
                DATABASE SYNCED ✓
              </motion.button>
            </motion.div>
          )}
        </section>

        <section className="px-6 md:px-12 lg:px-24 py-32 border-t-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)] transition-colors duration-500">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-50 mb-6">
              FINAL TRANSMISSION
            </p>
            <p
              className="font-mono font-black uppercase leading-none"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
            >
              THE SANCTUARY
              <br />
              <span className="opacity-40">IS ALWAYS OPEN.</span>
            </p>
            <p className="font-mono text-sm opacity-80 mt-8 max-w-lg leading-relaxed">
              No application. No interview. No 30-day challenge. Just arrive, observe, and resist
              the urge to optimize your arrival.
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
