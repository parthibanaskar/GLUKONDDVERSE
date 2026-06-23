'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type FretNumber = 0 | 1 | 2 | 3;

interface CapoContextType {
  activeFret: FretNumber;
  setActiveFret: (fret: FretNumber) => void;
  fretConfig: FretConfig;
}

export interface FretConfig {
  bg: string;
  fg: string;
  accent: string;
  label: string;
  cursorType: 'crosshair' | 'knob' | 'focus-ring' | 'block';
  fontStyle: 'mono' | 'distressed' | 'serif' | 'brutalist';
  noiseOverlay: boolean;
  cinematicBars: boolean;
  invertColors: boolean;
  description: string;
  capoBgContainer: string;
  capoBgActive: string;
  capoTextActive: string;
  capoTextInactive: string;
  capoBorder: string;
  imageGlobalFilter: string;
}

const FRET_CONFIGS: Record<FretNumber, FretConfig> = {
  0: {
    bg: '#000000',
    fg: '#ffffff',
    accent: '#EAB308',
    label: 'TECH BASE',
    cursorType: 'crosshair',
    fontStyle: 'mono',
    noiseOverlay: false,
    cinematicBars: false,
    invertColors: false,
    description: 'FRET 0 TECH-BASE',
    capoBgContainer: 'rgba(20, 20, 20, 0.6)',
    capoBgActive: '#EAB308',
    capoTextActive: '#000000',
    capoTextInactive: 'rgba(255, 255, 255, 0.35)',
    capoBorder: 'rgba(234, 179, 8, 0.2)',
    imageGlobalFilter: 'sepia(1) hue-rotate(15deg) saturate(2.5) brightness(0.95) contrast(1.1)',
  },
  1: {
    bg: '#0d0a08',
    fg: '#ffffff',
    accent: '#DC2626',
    label: 'STUDIO VIBE',
    cursorType: 'knob',
    fontStyle: 'distressed',
    noiseOverlay: true,
    cinematicBars: false,
    invertColors: false,
    description: 'FRET 1 STUDIOVIBE',
    capoBgContainer: 'rgba(15, 12, 10, 0.7)',
    capoBgActive: '#DC2626',
    capoTextActive: '#ffffff',
    capoTextInactive: 'rgba(255, 255, 255, 0.35)',
    capoBorder: 'rgba(220, 38, 38, 0.2)',
    imageGlobalFilter: 'sepia(1) hue-rotate(340deg) saturate(3.5) brightness(0.8) contrast(1.2)',
  },
  2: {
    bg: '#040c06',
    fg: '#ffffff',
    accent: '#00FF66',
    label: 'MATRIX VIBE',
    cursorType: 'focus-ring',
    fontStyle: 'serif',
    noiseOverlay: false,
    cinematicBars: false,
    invertColors: false,
    description: 'FRET 2 MATRIX VIBE',
    capoBgContainer: 'rgba(6, 18, 9, 0.75)',
    capoBgActive: '#00FF66',
    capoTextActive: '#040c06',
    capoTextInactive: 'rgba(255, 255, 255, 0.35)',
    capoBorder: 'rgba(0, 255, 102, 0.25)',
    imageGlobalFilter: 'sepia(1) hue-rotate(90deg) saturate(3) brightness(0.9) contrast(1.15)',
  },
  3: {
    bg: '#ffffff',
    fg: '#000000',
    accent: '#000000',
    label: 'CLUB VIBE',
    cursorType: 'block',
    fontStyle: 'brutalist',
    noiseOverlay: false,
    cinematicBars: false,
    invertColors: true,
    description: 'FRET 3 CLUB VIBE',
    capoBgContainer: 'rgba(0, 0, 0, 0.05)',
    capoBgActive: '#000000',
    capoTextActive: '#ffffff',
    capoTextInactive: 'rgba(0, 0, 0, 0.3)',
    capoBorder: 'rgba(0, 0, 0, 0.15)',
    imageGlobalFilter: 'none',
  },
};

const CapoContext = createContext<CapoContextType>({
  activeFret: 0,
  setActiveFret: () => {},
  fretConfig: FRET_CONFIGS[0],
});

export function CapoProvider({ children }: { children: React.ReactNode }) {
  const [activeFret, setActiveFretState] = useState<FretNumber>(0);

  useEffect(() => {
    const savedFret = localStorage.getItem('activeFret');
    if (savedFret) {
      const parsed = parseInt(savedFret, 10);
      const validFrets = Object.keys(FRET_CONFIGS).map(Number);
      if (validFrets.includes(parsed)) {
        setActiveFretState(parsed as FretNumber);
      }
    }
  }, []);

  const setActiveFret = useCallback((fret: FretNumber) => {
    setActiveFretState(fret);
    localStorage.setItem('activeFret', fret.toString());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key;
      if (key === '0') setActiveFret(0);
      else if (key === '1') setActiveFret(1);
      else if (key === '2') setActiveFret(2);
      else if (key === '3') setActiveFret(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveFret]);

  const currentConfig = FRET_CONFIGS[activeFret];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--bg', currentConfig.bg);
      root.style.setProperty('--fg', currentConfig.fg);
      root.style.setProperty('--accent', currentConfig.accent);
      // For FOUC fix
      root.setAttribute('data-fret', activeFret.toString());
    }
  }, [currentConfig, activeFret]);

  return (
    <CapoContext.Provider
      value={{
        activeFret,
        setActiveFret,
        fretConfig: currentConfig,
      }}
    >
      <style
        key={activeFret}
        dangerouslySetInnerHTML={{
          __html: `
        .home-page .grayscale, .home-page .grayscale-100, .home-page [class*="grayscale"] {
          filter: none;
        }
        .home-page img, .home-page [class*="Image"] img {
          filter: ${currentConfig.imageGlobalFilter};
          transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `,
        }}
      />

      {children}
    </CapoContext.Provider>
  );
}

export function useCapo() {
  return useContext(CapoContext);
}

export { FRET_CONFIGS };
