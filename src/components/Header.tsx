'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import AppLogo from '@/components/ui/AppLogo';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CAREER', href: '/career' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'STUDIO', href: '/studio' },
  { label: 'CLUB', href: '/club' },
  { label: 'CONTACT', href: '/contact' },
];

const MotionLink = motion(Link);

export default function Header() {
  const { activeFret, fretConfig } = useCapo();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 40px threshold, scroll past the header height 
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>('a, button');
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleTab);
    first.focus();
    return () => document.removeEventListener('keydown', handleTab);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navBg =
    activeFret === 3
      ? scrolled
        ? 'rgba(255,255,255,0.95)'
        : 'rgba(255,255,255,0.85)'
      : scrolled
        ? 'rgba(0,0,0,0.92)'
        : 'rgba(0,0,0,0.75)';

  const textColor = activeFret === 3 ? '#000000' : '#ffffff';
  const borderColor = activeFret === 3 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)';

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 transition-all duration-300"
        style={{
          zIndex: 9999,
          background: fretConfig.cinematicBars ? 'transparent' : navBg,
          backdropFilter: fretConfig.cinematicBars ? 'none' : 'blur(12px)',
          borderBottom: scrolled ? `1px solid ${borderColor}` : 'none',
          height: fretConfig.cinematicBars ? '6rem' : '5rem',
          paddingTop: fretConfig.cinematicBars ? '1.5rem' : '0px',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 25 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="GlukonddVerse">
          <AppLogo size={36} className="transition-transform duration-300 group-hover:scale-110" />
          <span
            className="font-mono text-sm font-bold tracking-[0.2em] uppercase hidden sm:block"
            style={{ color: fretConfig.accent }}
          >
            GLUKONDD<span style={{ color: textColor }}>VERSE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
            return (
              <MagneticLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActive}
                textColor={textColor}
                accentColor={fretConfig.accent}
              />
            );
          })}
        </nav>

        {/* Right: Fret indicator + mobile menu */}
        <div className="flex items-center gap-4">
          <motion.div
            className="hidden md:flex items-center gap-2 text-mono text-[10px] tracking-widest uppercase px-3 py-1 border"
            style={{ borderColor: fretConfig.accent, color: fretConfig.accent }}
            key={activeFret}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: fretConfig.accent }}
            />
            {fretConfig.label}
          </motion.div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-between w-10 h-10 p-2.5 relative cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{ color: textColor }}
          >
            <motion.span
              className="block w-full h-[1.5px]"
              style={{ background: textColor }}
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 9 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-full h-[1.5px]"
              style={{ background: textColor }}
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-full h-[1.5px]"
              style={{ background: textColor }}
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -9 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
            style={{
              background: activeFret === 3 ? 'rgba(255,255,255,0.98)' : 'rgba(0,0,0,0.98)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  // each link staggers slightly ig
                  transition={{
                    delay: i * 0.08,
                    type: 'spring',
                    stiffness: 240,
                    damping: 22,
                  }}
                >
                  <Link
                    href={link.href}
                    className="font-mono text-3xl font-bold tracking-widest uppercase"
                    style={{ color: fretConfig.accent }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MagneticLink({
  href,
  label,
  isActive,
  textColor,
  accentColor,
}: {
  href: string;
  label: string;
  isActive: boolean;
  textColor: string;
  accentColor: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <MotionLink
      ref={ref}
      href={href}
      className="relative text-mono text-[11px] font-bold tracking-[0.2em] uppercase py-1 overflow-hidden cursor-pointer"
      style={{
        color: isActive ? accentColor : textColor,
        opacity: isActive ? 1 : 0.65,
      }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ opacity: 1 }}
    >
      {label}

      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-left"
        style={{ background: accentColor }}
        initial={{ scaleX: isActive ? 1 : 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </MotionLink>
  );
}
