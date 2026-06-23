import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import CapoEngine from '@/components/CapoEngine';
import GuestbookDrawer from '@/components/GuestbookDrawer';
import PageLoader from '@/components/ui/PageLoader';
import EngineeringLedger from './components/EngineeringLedger';
import ProjectsGrid from './components/ProjectsGrid';
import ExperienceTree from './components/ExperienceTree';
import { createServerClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Career — GlukonddVerse',
  description: 'Explore dimensions of Engineering and achievements.',
};

export default async function CareerPage() {
  const supabase = createServerClient();

  const [statsResponse, experienceResponse, projectsResponse] = await Promise.all([
    supabase.from('site_stats').select('*').single(),
    supabase.from('experiences').select('*').order('id', { ascending: false }),
    supabase.from('code_archive').select('*').order('id', { ascending: false }),
  ]);

  return (
    <>
      <CustomCursor />
      <Header />
      <CapoEngine />
      <GuestbookDrawer />
      <PageLoader lines={['ACCESSING LEDGER...', 'RETRIEVING RECORDS...', 'DECRYPTING DATA...']} />
      <main className="relative">
        <EngineeringLedger initialStats={statsResponse.data} />
        <ProjectsGrid initialProjects={projectsResponse.data || []} />
        <ExperienceTree initialExperiences={experienceResponse.data || []} />
      </main>
      <Footer />
    </>
  );
}
