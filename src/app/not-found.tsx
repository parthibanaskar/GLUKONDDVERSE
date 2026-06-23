'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCapo } from '@/context/CapoContext';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();
  const { fretConfig } = useCapo();

  useEffect(() => {
    if (sessionStorage.getItem('not_found_logged')) return;
    sessionStorage.setItem('not_found_logged', 'true');

    fetch('/api/log-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: '404',
        url: window.location.href,
        referer: document.referrer || 'Unknown',
      }),
    }).catch(() => {});
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 font-mono"
      style={{ backgroundColor: fretConfig.bg, color: fretConfig.fg }}
    >
      <div className="max-w-lg w-full space-y-8">
        <div
          className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-60"
          style={{ color: fretConfig.accent }}
        >
          SIGNAL LOST // 404
        </div>
        <h1
          aria-hidden="true"
          className="font-mono font-black leading-none select-none opacity-10"
          style={{ fontSize: 'clamp(5rem, 20vw, 12rem)', color: fretConfig.fg }}
        >
          404
        </h1>
        <div className="space-y-2">
          <h2 className="font-mono font-black text-2xl tracking-widest uppercase">
            404 - SECTOR NOT FOUND
          </h2>
          <p className="font-mono text-sm opacity-50 tracking-widest">
            The frequency you&apos;re tuning to doesn&apos;t exist in this dimension.
          </p>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => router.back()}
            className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase 
              px-6 py-3 border transition-colors hover:opacity-80"
            style={{
              borderColor: fretConfig.accent,
              color: fretConfig.accent,
            }}
          >
            ← GO BACK
          </button>

          <Link
            href="/"
            className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase 
              px-6 py-3 transition-colors hover:opacity-80"
            style={{
              backgroundColor: fretConfig.accent,
              color: fretConfig.bg,
            }}
          >
            RETURN TO BASE ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
