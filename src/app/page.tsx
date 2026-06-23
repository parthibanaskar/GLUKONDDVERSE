import React from 'react';
import CustomCursor from '@/components/CustomCursor';
import CameraFlash from './components/CameraFlash';
import CapoEngine from '@/components/CapoEngine';
import GuestbookDrawer from '@/components/GuestbookDrawer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import IdentityBlock from './components/IdentityBlock';

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <CameraFlash />
      <Header />
      <CapoEngine />
      <GuestbookDrawer />

      <main className="relative home-page">
        <HeroSection />
        <IdentityBlock />
      </main>

      <Footer />
    </>
  );
}
