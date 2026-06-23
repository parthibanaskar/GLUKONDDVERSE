import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import CapoEngine from '@/components/CapoEngine';
import GuestbookDrawer from '@/components/GuestbookDrawer';
import PageLoader from '@/components/ui/PageLoader';
import AboutHero from './components/AboutHero';
import SystemDiagram from './components/SystemDiagram';
import GitTimeline from './components/GitTimeline';
import SideQuests from './components/SideQuests';
import { createServerClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'About — GlukonddVerse',
  description: ' Parthiba — A developer, musician, and visual storyteller from Kolkata.',
};

export default async function AboutPage() {
  const supabase = await createServerClient();

  const [gitResponse, sideQuestsResponse] = await Promise.all([
    supabase.from('milestones').select('*').order('id', { ascending: false }),
    supabase.from('side_quests').select('*').order('id', { ascending: false }),
  ]);

  return (
    <>
      <CustomCursor />
      <Header />
      <CapoEngine />
      <GuestbookDrawer />
      <PageLoader
        lines={[
          '> LOADING DOSSIER...',
          '> PARSING IDENTITY MATRIX...',
          '> COMPILING TIMELINE...',
          '> ACCESS GRANTED.',
        ]}
      />
      <main className="relative">
        <AboutHero />
        <SystemDiagram />
        <GitTimeline initialMilestones={gitResponse.data || []} />
        <SideQuests initialQuests={sideQuestsResponse.data || []} />
      </main>
      <Footer />
    </>
  );
}
