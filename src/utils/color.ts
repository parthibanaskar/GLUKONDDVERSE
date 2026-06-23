export function isColorLight(hex: string): boolean {
  if (!hex) return false;
  if (hex === 'white' || hex === '#fff' || hex === '#ffffff') return true;
  if (hex === 'black' || hex === '#000' || hex === '#000000') return false;

  if (hex.startsWith('#')) {
    const raw = hex.replace('#', '');
    const full =
      raw.length === 3
        ? raw
            .split('')
            .map((c) => c + c)
            .join('')
        : raw;

    if (full.length === 6) {
      const r = parseInt(full.substring(0, 2), 16);
      const g = parseInt(full.substring(2, 4), 16);
      const b = parseInt(full.substring(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 128;
    }
  }
  return false;
}

export const hexToRgba = (hex: string = '#000000', alpha: number = 1) => {
  let sanitized = hex.replace('#', '');
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const r = parseInt(sanitized.substring(0, 2), 16) || 0;
  const g = parseInt(sanitized.substring(2, 4), 16) || 0;
  const b = parseInt(sanitized.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
