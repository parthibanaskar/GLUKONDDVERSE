'use client';
import { motion } from 'framer-motion';

interface SectionLabelProps {
  label: string;
  isInView: boolean;
  accent: string;
  className?: string;
}

export default function SectionLabel({
  label,
  isInView,
  accent,
  className = 'mb-16',
}: SectionLabelProps) {
  return (
    <motion.div
      className={`flex items-center gap-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <div className="w-12 h-px" style={{ background: accent }} />
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: accent }}>
        {label}
      </span>
    </motion.div>
  );
}
