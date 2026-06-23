'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import SectionLabel from '@/components/ui/SectionLabel';
import { useCapo } from '@/context/CapoContext';

const IDENTITIES = [
  {
    index: '01',
    title: 'WEB DEVELOPER',
    subtitle: 'Engineering precise, tactile digital experiences.',
    description:
      'From pixel-perfect layouts to systems architecture - building interfaces that communicate intention without apology. Every line of code is a directorial decision.',
    tags: ['NEXT.JS', 'REACT', 'NODE', 'TYPESCRIPT', 'JAVA'],
    href: '/career',
    cta: 'VIEW ENGINEERING LEDGER',
  },
  {
    index: '02',
    title: 'MUSICIAN',
    subtitle: 'Composer. Guitarist. Producer.',
    description:
      'Sound is the dimension code cannot reach. Writing compositions that occupy the space between technical precision and raw emotional resonance.',
    tags: ['GUITAR', 'COMPOSITION', 'RECORDING', 'PRODUCTION'],
    href: '/studio',
    cta: 'ACCESS THE SOUND',
  },
  {
    index: '03',
    title: 'CINEMATOGRAPHER',
    subtitle: 'Composing light as a primary language.',
    description:
      'Trained in the grammar of visual metaphor. Every frame is a deliberate act - a negotiation between what is shown and what is withheld. Pure cinema, no compromise.',
    tags: ['35MM AESTHETIC', 'COLOR GRADING', 'VISUAL METAPHOR', 'DIRECTION'],
    href: '/gallery',
    cta: 'ENTER THE LENS',
  },
];

export default function IdentityBlock() {
  const { fretConfig, activeFret } = useCapo();
  const blockRef = useRef<HTMLElement>(null);
  // section is tall so dont change from 15%
  const blockVisible = useInView(blockRef, { once: true, margin: '-15%' });

  const isBrute = activeFret === 3;
  const isCinema = activeFret === 2;

  return (
    <section
      ref={blockRef}
      className="relative px-6 md:px-12 lg:px-24 py-24"
      style={{ background: fretConfig.bg }}
    >
      <SectionLabel
        label="THE THREE DIMENSIONS"
        isInView={blockVisible}
        accent={fretConfig.accent}
      />

      {/*Identity cards*/}
      <div className="space-y-0">
        {IDENTITIES.map((identity, i) => (
          <IdentityCard
            key={identity.index}
            identity={identity}
            index={i}
            blockVisible={blockVisible}
            fretConfig={fretConfig}
            activeFret={activeFret}
            isBrute={isBrute}
            isCinema={isCinema}
          />
        ))}
      </div>
    </section>
  );
}

function IdentityCard({
  identity,
  index,
  blockVisible,
  fretConfig,
  activeFret,
  isBrute,
  isCinema,
}: {
  identity: (typeof IDENTITIES)[0];
  index: number;
  blockVisible: boolean;
  fretConfig: { accent: string; bg: string };
  activeFret: number;
  isBrute: boolean;
  isCinema: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const fg = isBrute ? '#000000' : '#ffffff';

  return (
    <motion.div
      className="relative border-t py-10 group cursor-pointer"
      style={{ borderColor: `${fg}15` }}
      initial={{ opacity: 0, y: 30 }}
      animate={blockVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 100, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-6 md:gap-10 items-start">
        {/*Index*/}
        <div>
          <span
            className="font-mono text-[11px] tracking-[0.3em] uppercase"
            style={{ color: fretConfig.accent, opacity: 0.5 }}
          >
            {identity.index}
          </span>
        </div>

        {/*Content*/}
        <div className="space-y-4">
          <motion.h2
            className="text-title font-bold"
            style={{
              fontFamily: isCinema ? 'var(--font-fraunces)' : 'var(--font-dm-sans)',
              fontStyle: isCinema ? 'italic' : 'normal',
              color: hovered ? fretConfig.accent : fg,
              transition: 'color 0.3s',
              fontWeight: isBrute ? 900 : 800,
            }}
          >
            {identity.title}
          </motion.h2>

          <p
            className="font-mono text-[11px] tracking-[0.15em] uppercase"
            style={{ color: fretConfig.accent, opacity: 0.7 }}
          >
            {identity.subtitle}
          </p>

          <motion.p
            className="text-sm leading-relaxed max-w-2xl"
            style={{
              color: fg,
              opacity: 0.6,
              fontFamily: isCinema ? 'var(--font-fraunces)' : undefined,
            }}
            animate={{ opacity: hovered ? 0.9 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {identity.description}
          </motion.p>

          {/*Tags*/}
          <div className="flex flex-wrap gap-2 mt-4">
            {identity.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 border"
                style={{
                  borderColor: `${fretConfig.accent}40`,
                  color: fretConfig.accent,
                  opacity: 0.7,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/*CTA*/}
        <Link href={identity.href} passHref legacyBehavior>
          <motion.a
            className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase px-4 py-2 border whitespace-nowrap self-center"
            style={{
              borderColor: fretConfig.accent,
              color: hovered ? (activeFret === 3 ? '#ffffff' : '#000000') : fretConfig.accent,
              background: hovered ? fretConfig.accent : 'transparent',
            }}
            animate={{
              background: hovered ? fretConfig.accent : 'transparent',
            }}
            transition={{ duration: 0.2 }}
          >
            {identity.cta} ↗
          </motion.a>
        </Link>
      </div>

      {/*Hover*/}
      <motion.div
        className="absolute bottom-0 left-0 h-px"
        style={{ background: fretConfig.accent }}
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
