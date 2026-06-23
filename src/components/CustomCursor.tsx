'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCapo } from '@/context/CapoContext';

import { hexToRgba } from '@/utils/color';

const CURSOR_SPRING = { damping: 25, stiffness: 300, mass: 0.5 };

export default function CustomCursor() {
  const { activeFret, fretConfig } = useCapo();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, CURSOR_SPRING);
  const cursorY = useSpring(mouseY, CURSOR_SPRING);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.('a, button, [data-cursor]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.('a, button, [data-cursor]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY]);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);
  if (isTouchDevice) return null;

  const renderCursor = () => {
    switch (activeFret) {
      case 0:
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000]"
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
          >
            <div className="relative w-6 h-6" style={{ opacity: isVisible ? 1 : 0 }}>
              <div
                className="absolute top-1/2 left-0 right-0 h-px"
                style={{ background: fretConfig.accent }}
              />
              <div
                className="absolute left-1/2 top-0 bottom-0 w-px"
                style={{ background: fretConfig.accent }}
              />
              <motion.div
                className="absolute inset-0 border"
                style={{ borderColor: fretConfig.accent, opacity: 0.4 }}
                animate={{ scale: isHovering ? 2 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000]"
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
          >
            <motion.div
              className="rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: fretConfig.accent,
                background: isHovering ? fretConfig.accent : 'transparent',
                opacity: isVisible ? 1 : 0,
              }}
              animate={{ width: isHovering ? 40 : 16, height: isHovering ? 40 : 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {isHovering && (
                <div className="w-2 h-2 rounded-full" style={{ background: '#000' }} />
              )}
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000]"
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
          >
            <div
              className="relative flex items-center justify-center w-14 h-14"
              style={{ opacity: isVisible ? 1 : 0 }}
            >
              <motion.div
                className="absolute inset-0 border border-double"
                style={{
                  borderColor: hexToRgba(fretConfig.accent, 0.35),
                  backgroundColor: hexToRgba(fretConfig.accent, 0.04),
                }}
                animate={{
                  rotate: isHovering ? 90 : 0,
                  scale: isHovering ? 1.15 : 1,
                  borderRadius: isHovering ? '30%' : '50%',
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              />

              <motion.div
                className="w-2 h-2 rounded-full z-10"
                style={{
                  backgroundColor: fretConfig.accent,
                  boxShadow: `0 0 10px ${fretConfig.accent}`,
                }}
                animate={{
                  scale: isHovering ? [1, 2, 1.3, 1.8, 1] : [1, 1.4, 1],
                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000]"
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
          >
            <motion.div
              className="relative flex items-center justify-center"
              style={{ opacity: isVisible ? 1 : 0 }}
              animate={{ scale: isHovering ? 1.5 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="w-8 h-8 border-2 rounded-full" style={{ borderColor: '#000000' }} />
              <div className="absolute w-1 h-1 rounded-full" style={{ background: '#000000' }} />
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return <>{renderCursor()}</>;
}
