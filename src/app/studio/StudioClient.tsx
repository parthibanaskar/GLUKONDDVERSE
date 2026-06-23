'use client';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import CapoEngine from '@/components/CapoEngine';
import GuestbookDrawer from '@/components/GuestbookDrawer';
import PageLoader from '@/components/ui/PageLoader';
import BandIntro from './components/BandIntro';
import StudioGallery from './components/StudioGallery';

export default function StudioClient() {
  return (
    <>
      <CustomCursor />
      <Header />
      <CapoEngine />
      <GuestbookDrawer />
      <PageLoader
        lines={[
          '> INITIALIZING SOUND ENGINE...',
          '> LOADING BAND MATRIX...',
          '> DIMENSION 4 ONLINE.',
        ]}
      />

      <main className="relative">
        <BandIntro />
      </main>

      <StudioGallery />
      <Footer />
    </>
  );
}
