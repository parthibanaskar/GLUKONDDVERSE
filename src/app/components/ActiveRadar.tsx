'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import { supabase } from '@/utils/supabase/client';

interface Deployment {
  id: string | number;
  name: string;
  status: string;
  uptime: string;
}

export default function ActiveRadar() {
  const { fretConfig, activeFret } = useCapo();
  const [pingActive, setPingActive] = useState(true);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRadarSites() {
      try {
        const { data, error } = await supabase
          .from('radar_sites')
          .select('id, name, status, uptime')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && isMounted) {
          setDeployments(data as Deployment[]);
        }
      } catch (err) {
        console.error('Error fetching radar deployment signals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // last thing was hitting api route directly so supabase client is good yea
    // const res = await fetch('/api/radar');
    // const data = await res.json();
    fetchRadarSites();

    return () => {
      isMounted = false;
    };
  }, []);

  //Radar Ping
  useEffect(() => {
    const interval = setInterval(() => setPingActive((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      live: '#22c55e',
      building: fretConfig.accent,
      idle: '#525252',
    };
    return colors[(status || '').toLowerCase()] || colors.idle;
  };

  return (
    <motion.div
      className="w-full max-w-sm relative overflow-hidden"
      style={{
        background: activeFret === 3 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${fretConfig.accent}40`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: `${fretConfig.accent}30` }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#22c55e' }}
            animate={{ opacity: pingActive ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: fretConfig.accent }}
          >
            ACTIVE RADAR
          </span>
        </div>
        <span
          className="font-mono text-[9px] tracking-widest"
          style={{ color: fretConfig.accent, opacity: 0.5 }}
        >
          LIVE SITES
        </span>
      </div>

      {/*Deployments*/}
      <div className="divide-y" style={{ borderColor: `${fretConfig.accent}15` }}>
        {loading ? (
          <div
            className="px-4 py-6 font-mono text-[9px] tracking-[0.2em] uppercase text-center opacity-40 animate-pulse"
            style={{ color: activeFret === 3 ? '#000000' : '#ffffff' }}
          >
            SCANNING AIRSPACE...
          </div>
        ) : deployments.length === 0 ? (
          <div
            className="px-4 py-6 font-mono text-[9px] tracking-[0.2em] uppercase text-center opacity-40"
            style={{ color: activeFret === 3 ? '#000000' : '#ffffff' }}
          >
            NO SIGNALS FOUND
          </div>
        ) : (
          deployments.map((dep, i) => (
            <motion.div
              key={dep.id}
              className="flex items-center justify-between px-4 py-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: getStatusColor(dep.status) }}
                />
                <div>
                  <div
                    className="font-mono text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: activeFret === 3 ? '#000000' : '#ffffff' }}
                  >
                    {dep.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: getStatusColor(dep.status) }}
                >
                  {dep.status}
                </div>
                <div
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: activeFret === 3 ? '#000000' : '#ffffff', opacity: 0.4 }}
                >
                  {dep.uptime}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/*Footer*/}
      <div className="px-4 py-2 border-t" style={{ borderColor: `${fretConfig.accent}20` }}>
        <span
          className="font-mono text-[9px] tracking-[0.2em] uppercase"
          style={{ color: fretConfig.accent, opacity: 0.4 }}
        >
          {deployments.length > 0
            ? `SYS PING: ${deployments.length} TARGETS FOUND`
            : 'SYS PING: STANDBY'}
        </span>
      </div>

      {/*Scanline*/}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${fretConfig.accent}04 3px, ${fretConfig.accent}04 4px)`,
        }}
      />
    </motion.div>
  );
}
