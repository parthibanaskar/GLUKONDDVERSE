import React from 'react';
import type { Metadata } from 'next';
import StudioClient from './StudioClient';

export const metadata: Metadata = {
  title: 'Studio — GlukonddVerse',
  description: 'Explore the sound engine and band matrix.',
};

export default function StudioPage() {
  return <StudioClient />;
}
