'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';

const SOCIAL_LINKS = [
  { label: 'GITHUB', href: 'https://github.com/parthibanaskar', icon: 'GH' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/parthibanaskar', icon: 'LI' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/glukondd', icon: 'IG' },
  {
    label: 'EMAIL',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=contact.parthibanaskar@gmail.com',
    icon: '@',
  },
];

export default function Footer() {
  const { fretConfig, activeFret } = useCapo();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // toLocaleString with IST timezone, easier
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const h = ist.getHours().toString().padStart(2, '0');
      const m = ist.getMinutes().toString().padStart(2, '0');
      const s = ist.getSeconds().toString().padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const bg = fretConfig.bg;
  const fg = fretConfig.fg;
  const border = activeFret === 3 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)';

  return (
    <footer
      className="relative w-full border-t px-6 md:px-12 py-10"
      style={{ background: bg, borderColor: border }}
    >
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-8">
        {SOCIAL_LINKS.map((link) => (
          <GlitchSocialLink
            key={link.label}
            href={link.href}
            label={link.label}
            accentColor={fretConfig.accent}
            fg={fg}
          />
        ))}
      </div>

      <div className="w-full h-px mb-8" style={{ background: border }} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className="font-mono text-[11px] tracking-[0.25em] uppercase flex flex-col items-center md:items-start gap-1"
          style={{ color: fg, opacity: 0.5 }}
        >
          <span>© {new Date().getFullYear()} GLUKONDDVERSE. ALL RIGHTS RESERVED.</span>
          <span> ENGINEERED BY PARTHIBA </span>
        </div>
        <motion.span
          className="font-mono text-[11px] tracking-[0.15em] uppercase"
          style={{ color: fretConfig.accent, opacity: 0.8 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          SYS.SYNC: IST [{time}]
        </motion.span>
      </div>
    </footer>
  );
}

function GlitchSocialLink({
  href,
  label,
  accentColor,
  fg,
}: {
  href: string;
  label: string;
  accentColor: string;
  fg: string;
}) {
  const [glitching, setGlitching] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setPos({ x, y });
  };

  const isEmail = href.startsWith('mailto:');

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      onClick={(e) => {
        if (isEmail) {
          e.preventDefault();
          window.location.href = href;
        }
      }}
      className="relative font-mono text-[11px] font-bold tracking-[0.3em] uppercase py-2 px-1 overflow-hidden"
      style={{ color: fg }}
      animate={{ x: pos.x, y: pos.y }}
      // spring feels floaty here which is the point
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setPos({ x: 0, y: 0 });
        setGlitching(false);
      }}
      onMouseEnter={() => setGlitching(true)}
      whileHover={{ color: accentColor }}
      data-text={label}
    >
      {label}
      {glitching && (
        <>
          <span
            className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold tracking-[0.3em] uppercase pointer-events-none"
            style={{
              color: '#ff0040',
              clipPath: 'inset(30% 0 50% 0)',
              transform: 'translateX(-2px)',
              opacity: 0.7,
            }}
          >
            {label}
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold tracking-[0.3em] uppercase pointer-events-none"
            style={{
              color: '#0040ff',
              clipPath: 'inset(60% 0 20% 0)',
              transform: 'translateX(2px)',
              opacity: 0.7,
            }}
          >
            {label}
          </span>
        </>
      )}
    </motion.a>
  );
}
