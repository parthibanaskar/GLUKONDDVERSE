'use client';
import { useEffect } from 'react';

export default function SecurityShield() {
  useEffect(() => {

    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };
    document.addEventListener('dragstart', handleDragStart);

    const logo = `
   _____ _    _    _ _  _____  _   _ _____  _____ 
  / ____| |  | |  | | |/ / _ \\| \\ | |  __ \\|  __ \\
 | |  __| |  | |  | | ' / | | |  \\| | |  | | |  | |
 | | |_ | |  | |  | |  <| | | | . \` | |  | | |  | |
 | |__| | |__| |__| | . \\ |_| | |\\  | |__| | |__| |
  \\_____|_____\\____/|_|\\_\\___/|_| \\_|_____/|_____/ 
    `;

    console.info(`%c${logo}`, 'color: #9b59b6; font-weight: bold;');
    console.info(
      '%cAh, inspecting the source code? I respect that.',
      'color: #ffffff; font-size: 14px; font-weight: bold;'
    );
    console.info(
      '%cIf you actually understand the architecture running here, maybe we should talk.',
      'color: #aaaaaa; font-size: 12px; font-style: italic;'
    );

    return () => {

      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
