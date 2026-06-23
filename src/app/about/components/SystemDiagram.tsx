'use client';
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import SectionLabel from '@/components/ui/SectionLabel';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'core' | 'branch' | 'leaf';
}

interface Edge {
  from: string;
  to: string;
}

const NODES: Node[] = [
  { id: 'core', label: 'PARTHIBA', x: 50, y: 50, type: 'core' },
  { id: 'dev', label: 'WEB DEV', x: 20, y: 20, type: 'branch' },
  { id: 'cinema', label: 'CINEMA', x: 80, y: 20, type: 'branch' },
  { id: 'music', label: 'MUSIC', x: 50, y: 85, type: 'branch' },
  { id: 'react', label: 'FRONTEND', x: 5, y: 8, type: 'leaf' },
  { id: 'next', label: 'BACKEND', x: 20, y: 5, type: 'leaf' },
  { id: 'ts', label: 'SYSTEM DESIGN', x: 35, y: 10, type: 'leaf' },
  { id: 'frame', label: 'FRAMING', x: 70, y: 8, type: 'leaf' },
  { id: 'light', label: 'LIGHTING', x: 85, y: 5, type: 'leaf' },
  { id: 'color', label: 'COLOR', x: 95, y: 15, type: 'leaf' },
  { id: 'guitar', label: 'GUITAR', x: 38, y: 95, type: 'leaf' },
  { id: 'compose', label: 'COMPOSE', x: 62, y: 95, type: 'leaf' },
];

const EDGES: Edge[] = [
  { from: 'core', to: 'dev' },
  { from: 'core', to: 'cinema' },
  { from: 'core', to: 'music' },
  { from: 'dev', to: 'react' },
  { from: 'dev', to: 'next' },
  { from: 'dev', to: 'ts' },
  { from: 'cinema', to: 'frame' },
  { from: 'cinema', to: 'light' },
  { from: 'cinema', to: 'color' },
  { from: 'music', to: 'guitar' },
  { from: 'music', to: 'compose' },
];

export default function SystemDiagram() {
  const { fretConfig } = useCapo();
  const ref = useRef<HTMLElement>(null);

  const entered = useInView(ref, { once: true, margin: '-12%' });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (entered) {
      const t = setTimeout(() => setDrawn(true), 300);
      return () => clearTimeout(t);
    }
  }, [entered]);

  const fg = fretConfig.fg;

  function getNode(id: string): Node | undefined {
    return NODES.find((n) => n.id === id);
  }

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-12 lg:px-24 py-24"
      style={{ background: fretConfig.bg }}
    >
      <SectionLabel
        label="IDENTITY MATRIX // SYSTEM MAP"
        isInView={entered}
        accent={fretConfig.accent}
      />

      <div className="relative w-full" style={{ paddingBottom: '60%' }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Identity system diagram showing me at the core, branching into Web Dev (Frontend, Backend, System Design), Cinema (Framing, Lighting, Color), and Music (Guitar, Compose)"
        >
          <title>Identity Matrix — System Map</title>
          {/*Edges*/}
          {EDGES.map((edge, i) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            if (!from || !to) return null;
            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={from.x * 10}
                y1={from.y * 10}
                x2={to.x * 10}
                y2={to.y * 10}
                stroke={fretConfig.accent}
                strokeWidth="3"
                strokeOpacity="0.4"
                strokeDasharray="2000"
                strokeDashoffset={drawn ? 0 : 2000}
                style={{ transition: `stroke-dashoffset ${0.6 + i * 0.1}s ease-out` }}
              />
            );
          })}

          {/*Nodes*/}
          {NODES.map((node, i) => (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={entered ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <circle
                cx={node.x * 10}
                cy={node.y * 10}
                r={node.type === 'core' ? 30 : node.type === 'branch' ? 20 : 12}
                fill={
                  node.type === 'core'
                    ? fretConfig.accent
                    : fretConfig.bg === '#ffffff'
                      ? '#000000'
                      : fretConfig.bg
                }
                stroke={fretConfig.accent}
                strokeWidth={node.type === 'core' ? 0 : 3}
              />
              <text
                x={node.x * 10}
                y={node.y * 10 - (node.type === 'core' ? 55 : 40)}
                textAnchor="middle"
                fontSize={node.type === 'core' ? '24' : node.type === 'branch' ? '18' : '14'}
                fill={node.type === 'core' ? fretConfig.accent : fg}
                fontFamily="var(--font-jetbrains-mono), monospace"
                fontWeight={node.type === 'core' ? '700' : '400'}
                opacity={node.type === 'core' ? 1 : 0.7}
                letterSpacing="0.2em"
              >
                {node.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </section>
  );
}
