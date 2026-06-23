'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';
import AppImage from '@/components/ui/AppImage';
import SectionLabel from '@/components/ui/SectionLabel';
import type { Project } from '@/types';

export default function ProjectsGrid({ initialProjects }: { initialProjects: Project[] }) {
  const { fretConfig } = useCapo();
  const accent = fretConfig.accent;
  const bg = fretConfig.bg;

  const gridRef = useRef<HTMLElement>(null);
  const gridVisible = useInView(gridRef, { once: true, margin: '-10%' });
  const projects = initialProjects || [];

  return (
    <section
      ref={gridRef}
      className="relative px-6 md:px-12 lg:px-24 py-24"
      style={{ background: bg }}
    >
      <SectionLabel
        label={`CODE ARCHIVE // ${projects.length} ENTRIES`}
        isInView={gridVisible}
        accent={accent}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { fretConfig, activeFret } = useCapo();
  const accent = fretConfig.accent;
  const bg = fretConfig.bg;

  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: '-8%' });

  const statusColors: Record<Project['status'], string> = {
    live: '#22c55e',
    building: accent,
    archived: '#525252',
  };

  // tap triggered hovering thing so yea
  const isTouchDevice = useRef(false);

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        style={{ borderColor: `${fretConfig.fg}15`, borderWidth: '1px' }}
        className="border"
        onMouseEnter={() => {
          if (!isTouchDevice.current) setHovered(true);
        }}
        onMouseLeave={() => {
          if (!isTouchDevice.current) setHovered(false);
        }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onTouchStart={() => {
          isTouchDevice.current = true;
          setHovered((prev) => !prev);
        }}
        tabIndex={0}
        role="button"
        aria-label={`${project.title} — ${project.status}. Press Enter to view project links.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setHovered((prev) => !prev);
          }
        }}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <AppImage
            src={project.image}
            alt={project.imageAlt || 'Project Image'}
            fill
            className="object-cover transition-transform duration-700"
            quality={100}
            style={{
              transform: hovered ? 'scale(0.95)' : 'scale(1)',
              filter: activeFret === 2 ? 'grayscale(100%)' : 'none',
            }}
          />

          <div className="flex gap-3 p-4 md:hidden absolute bottom-0 left-0 z-10 w-full bg-black/80 backdrop-blur-sm">
            {project.github_url && (
              <a
                href={project.github_url}
                className="text-[10px] text-white font-mono tracking-widest border border-white/20 px-3 py-1"
              >
                GITHUB ↗
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                className="text-[10px] font-mono tracking-widest px-3 py-1"
                style={{ background: accent, color: '#000' }}
              >
                LIVE ↗
              </a>
            )}
          </div>

          <motion.div
            className="absolute inset-0 hidden md:flex flex-col items-center justify-center p-6"
            style={{
              background: 'rgba(0,0,0,0.95)',
              pointerEvents: hovered ? 'auto' : 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {Array.isArray(project.tech) &&
                project.tech.map((t: string) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1"
                    style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                  >
                    {t}
                  </span>
                ))}
            </div>

            <div className="flex gap-4">
              {project.github_url && (
                <motion.a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-3 border border-white/30 text-white"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={hovered ? 0 : -1}
                >
                  VIEW GITHUB ↗
                </motion.a>
              )}

              {project.live_url && (
                <motion.a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-3 border"
                  style={{
                    background: accent,
                    borderColor: accent,
                    color: '#000000',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={hovered ? 0 : -1}
                >
                  LIVE SITE ↗
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>

        <div className="p-6 space-y-3" style={{ background: bg }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: statusColors[project.status] || '#525252' }}
              />
              <span
                className="font-mono text-[9px] tracking-[0.3em] uppercase"
                style={{ color: statusColors[project.status] || '#525252' }}
              >
                {project.status}
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-widest text-ink/30">{project.year}</span>
          </div>

          <h3 className="font-mono text-lg font-bold tracking-[0.1em] uppercase text-ink">
            {project.title}
          </h3>
          <p
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: accent, opacity: 0.7 }}
          >
            {project.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-ink/55">{project.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
