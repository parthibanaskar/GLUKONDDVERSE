'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import CapoEngine from '@/components/CapoEngine';
import PageLoader from '@/components/ui/PageLoader';

export default function ContactPage() {
  const { activeFret, fretConfig } = useCapo();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', botField: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const themeInk = fretConfig.accent || '#ffffff';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setFormData({ name: '', email: '', message: '', botField: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-transparent text-[var(--ink)] transition-colors duration-500 flex flex-col"
      style={{ '--ink': themeInk } as React.CSSProperties}
    >
      <CustomCursor />
      <Header />
      <CapoEngine />
      <PageLoader lines={['> ESTABLISHING SECURE CONNECTION...', '> LOCATING GLUKONDD...']} />

      <main className="flex-1 flex items-center justify-center px-6 md:px-12 pt-32 pb-24 relative z-10">
        <motion.div
          className="w-full max-w-2xl border-2 p-8 md:p-12"
          style={{
            borderColor: 'var(--ink)',
            background: activeFret === 3 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10 relative">
            <h1 className="font-mono text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
              DIRECT LINE.
            </h1>
            <p className="font-mono text-sm opacity-60">
              Bypass the noise. Transmit directly to the private server.
            </p>

            {/* cat*/}
            <motion.img
              src="https://media.tenor.com/Fw8_rB2k_U0AAAAi/maxwell-cat.gif"
              alt="Maxwell the Cat"
              className="absolute right-0 -top-8 md:-top-12 w-20 md:w-24 object-contain pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            />
          </div>

          {status === 'success' ? (
            <motion.div
              className="py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="font-mono text-xl font-bold mb-4">TRANSMISSION SUCCESSFUL ✓</div>
              <p className="font-mono text-sm opacity-60">
                Your message has been intercepted and securely logged.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 font-mono text-[10px] tracking-widest uppercase border px-4 py-2 hover:bg-[var(--ink)] hover:text-black transition-colors"
                style={{ borderColor: 'var(--ink)' }}
              >
                SEND ANOTHER
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                    Designation / Name
                  </label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    autoComplete="name"
                    className="w-full bg-transparent border-b-2 p-2 font-mono text-sm outline-none transition-colors"
                    style={{ borderColor: 'var(--ink)' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    autoComplete="email"
                    className="w-full bg-transparent border-b-2 p-2 font-mono text-sm outline-none transition-colors"
                    style={{ borderColor: 'var(--ink)' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                  Encrypted Payload / Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  className="w-full bg-transparent border-2 p-3 font-mono text-sm outline-none transition-colors resize-none"
                  style={{ borderColor: 'var(--ink)' }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {status === 'error' && (
                <div className="text-red-500 font-mono text-xs uppercase">
                  TRANSMISSION FAILED. PLEASE RETRY.
                </div>
              )}

              <input
                type="text"
                name="botField"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                aria-label="Bot field"
                value={formData.botField}
                onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
              />

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 font-mono text-[11px] font-bold tracking-[0.3em] uppercase border-2 transition-all duration-300 disabled:opacity-50 hover:scale-[0.98]"
                style={{
                  borderColor: 'var(--ink)',
                  background: 'var(--ink)',
                  color: activeFret === 3 ? '#ffffff' : '#000000',
                }}
              >
                {status === 'submitting' ? 'TRANSMITTING...' : 'INITIATE TRANSMISSION'}
              </button>
            </form>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
