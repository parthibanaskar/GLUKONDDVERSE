'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import { supabase } from '@/utils/supabase/client';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  isPublic: boolean;
}

interface DBMarkRow {
  id: number;
  created_at: string;
  name: string;
  message: string;
  is_public: boolean;
}

export default function GuestbookDrawer() {
  const { fretConfig, activeFret } = useCapo();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      return;
    }

    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a, button, input, textarea'
    );
    if (focusable && focusable.length > 0) {
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
      // first.focus(); // can be distracting 
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPublicMarks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedEntries: GuestbookEntry[] = (data as DBMarkRow[]).map((row) => ({
          id: String(row.id),
          name: row.name,
          message: row.message,
          timestamp: row.created_at,
          isPublic: row.is_public,
        }));
        setEntries(formattedEntries);
      } else if (error) {
        console.error('Failed to fetch marks:', error.message);
      }

      setLoading(false);
    };

    fetchPublicMarks();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    setErrorMsg('');
    setIsPending(true);
    const finalName = name.trim() || 'Anonymous';

    try {
      const response = await fetch(`/api/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          message: message.trim(),
          isPublic: isPublic,
        }),
      });

      if (!response.ok) {
        setErrorMsg('failed to send dude wanna try again?');
        return;
      }

      const result = await response.json();
      setSubmitted(true);

      if (isPublic && result.data) {
        const newEntry: GuestbookEntry = {
          id: String(result.data.id),
          name: result.data.name,
          message: result.data.message,
          timestamp: result.data.created_at,
          isPublic: result.data.is_public,
        };
        setEntries((prev) => [newEntry, ...prev]);
      }

      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg('something went wrong');
    } finally {
      setIsPending(false);
    }
  };

  const bg = fretConfig.bg;
  const fg = fretConfig.fg;
  const borderColor = activeFret === 3 ? '#000000' : 'rgba(255,255,255,0.2)';

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        className="fixed bottom-8 right-6 md:right-8 z-[90] font-mono text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-3 border"
        style={{
          background: fretConfig.accent,
          color: activeFret === 3 ? '#ffffff' : '#000000',
          borderColor: fretConfig.accent,
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        LEAVE A MARK ↗
      </motion.button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Guestbook Terminal"
              className="fixed top-0 right-0 bottom-0 z-[96] w-full md:w-[400px] flex flex-col border-l overflow-hidden"
              style={{
                background: bg,
                borderColor: borderColor,
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor }}
              >
                <span
                  className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase"
                  style={{ color: fretConfig.accent }}
                >
                  GUESTBOOK TERMINAL
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-[11px] tracking-widest"
                  style={{ color: fg, opacity: 0.5 }}
                >
                  [ESC]
                </button>
              </div>

              {/* Entries */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div
                  className="font-mono text-[10px] tracking-widest uppercase mb-4"
                  style={{ color: fretConfig.accent, opacity: 0.6 }}
                >
                  &gt; PUBLIC MESSAGES [{entries.length}]
                </div>

                {loading ? (
                  <div
                    className="font-mono text-[11px] tracking-widest animate-pulse"
                    style={{ color: fg, opacity: 0.5 }}
                  >
                    loading...
                  </div>
                ) : entries.length === 0 ? (
                  <div
                    className="font-mono text-[11px] tracking-widest"
                    style={{ color: fg, opacity: 0.3 }}
                  >
                    NO MARKS RECORDED YET. BE THE FIRST.
                  </div>
                ) : (
                  entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="border-l-2 pl-4 py-1"
                      style={{ borderColor: fretConfig.accent }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <div
                        className="font-mono text-[10px] tracking-widest uppercase mb-1"
                        style={{ color: fretConfig.accent }}
                      >
                        {entry.name}
                      </div>
                      <p
                        className="font-mono text-[11px] leading-relaxed mb-2"
                        style={{ color: fg, opacity: 0.8 }}
                      >
                        {entry.message}
                      </p>
                      <span
                        className="font-mono text-[9px] tracking-widest"
                        style={{ color: fg, opacity: 0.3 }}
                      >
                        {new Date(entry.timestamp).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          hour12: false,
                        })}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input Form */}
              <div className="px-6 py-6 border-t" style={{ borderColor }}>
                <div
                  className="font-mono text-[10px] tracking-widest uppercase mb-4"
                  style={{ color: fretConfig.accent, opacity: 0.6 }}
                >
                  &gt; NEW ENTRY
                </div>

                {/* Public/Private Toggle */}
                {/* private ones go straight to discord, public ones go supabase */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border transition-all"
                    style={{
                      background: isPublic ? fretConfig.accent : 'transparent',
                      color: isPublic ? (activeFret === 3 ? '#ffffff' : '#000000') : fg,
                      borderColor: fretConfig.accent,
                      opacity: isPublic ? 1 : 0.4,
                    }}
                  >
                    PUBLIC
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border transition-all"
                    style={{
                      background: !isPublic ? fretConfig.accent : 'transparent',
                      color: !isPublic ? (activeFret === 3 ? '#ffffff' : '#000000') : fg,
                      borderColor: fretConfig.accent,
                      opacity: !isPublic ? 1 : 0.4,
                    }}
                  >
                    PRIVATE
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="IDENTIFIER // (OPTIONAL)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b py-2 font-mono text-[11px] tracking-widest uppercase focus:outline-none placeholder:opacity-30"
                    style={{
                      borderColor: fg,
                      color: fg,
                    }}
                  />
                  <textarea
                    required
                    placeholder={
                      isPublic
                        ? 'TRANSMIT PUBLIC MESSAGE...'
                        : 'TRANSMIT PRIVATE TRANSMISSION TO PARTHIBA...'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border py-2 px-3 font-mono text-[11px] leading-relaxed focus:outline-none placeholder:opacity-30 resize-none"
                    style={{
                      borderColor: `${fg}30`,
                      color: fg,
                    }}
                  />
                  <motion.button
                    type="submit"
                    disabled={isPending || submitted}
                    className="w-full font-mono text-[11px] font-bold tracking-[0.2em] uppercase py-3 border transition-all"
                    style={{
                      background: submitted ? fretConfig.accent : 'transparent',
                      color: submitted ? '#000000' : fretConfig.accent,
                      borderColor: fretConfig.accent,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {submitted
                      ? '✓ sent'
                      : errorMsg
                        ? errorMsg
                        : isPending
                          ? 'sending...'
                          : '> TRANSMIT'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
