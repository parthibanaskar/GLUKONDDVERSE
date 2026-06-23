import React from 'react';
import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery — GlukonddVerse',
  description: 'Stills & Motion — Visual Ledger.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
