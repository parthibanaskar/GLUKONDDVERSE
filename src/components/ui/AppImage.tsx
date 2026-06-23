'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { ComponentProps } from 'react';

interface AppImageProps extends Omit<ComponentProps<typeof Image>, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export default function AppImage({
  fallbackSrc = '/assets/images/no_image.png',
  alt,
  ...props
}: AppImageProps) {
  const [src, setSrc] = useState(props.src);

  useEffect(() => {
    setSrc(props.src);
  }, [props.src]);

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={typeof src === 'string' && src.startsWith('http')}
      onError={() => setSrc(fallbackSrc)}
    />
  );
}
