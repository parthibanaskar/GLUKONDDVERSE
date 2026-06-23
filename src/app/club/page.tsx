import React from 'react';
import type { Metadata } from 'next';
import { createServerClient } from '@/utils/supabase/server';
import ClubClient from './ClubClient';

export const metadata: Metadata = {
  title: 'Club — GlukonddVerse',
  description: 'STOP TRYING - START GIVING UP!',
};

export default async function ClubPage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from('merch_items')
    .select('*')
    .order('created_at', { ascending: true });

  return <ClubClient initialMerch={data || []} />;
}
